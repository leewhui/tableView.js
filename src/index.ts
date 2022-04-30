import Konva from 'konva';
import { Resizer } from './resizer';
import { Selector } from './selection';
import { ColumnInterface, ComponentInterface, DataInterface, defaultConfig, TableInterface } from './type';
import EventEmitter from 'eventemitter3';
import { creatText, Wrapper } from './wrapper';
import { cloneDeep } from 'lodash';
import { TextComponent } from './components/textComponent';
import { LinkComponent } from './components/linkComponent';

export class TableView {
  container: HTMLDivElement;
  stage: Konva.Stage;
  layer: Konva.Layer;

  colunmGroup: Konva.Group = new Konva.Group({ name: 'column group' });
  resizerGroup: Konva.Group = new Konva.Group({ name: 'resizer group' });

  config: TableInterface;
  wrapperManager: Wrapper;
  data_cell = new Konva.Rect({
    fill: 'white',
    name: 'data_cell',
    stroke: '#dee0e3',
    strokeWidth: 1.5,
  })
  selector: Selector;
  resizer: Resizer;
  emitter: EventEmitter = new EventEmitter();

  constructor(container: HTMLDivElement, config: TableInterface = defaultConfig) {
    this.container = container;
    this.config = config;
    this.stage = new Konva.Stage({
      container: this.container,
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    });

    this.layer = new Konva.Layer();

    // 鼠标点击单元格，dom容器
    this.wrapperManager = new Wrapper(this.container);
    document.body.appendChild(this.wrapperManager.wrapper);

    this.stage.add(this.layer);
    this.selector = new Selector(this.stage, this.emitter, this.container, this.colunmGroup);
    this.resizer = new Resizer(this.stage, this.resizerGroup, this.resize);

    this.emitter.on('onselect', this.onselectCell)

    this.emitter.on('blur', () => {
      this.wrapperManager.resetWrapper();
      this.resizer.setEnable(true);
    });

    this.apply(new TextComponent(this.setState, this.emitter), new LinkComponent(this.setState, this.emitter));
    this.draw();
  }

  setState = (data: DataInterface) => {
    this.config.columns[data.index[0]].data[data.index[1]] = data;
    this.resizer.setEnable(false);
    this.wrapperManager.resetWrapper();
    this.draw();
    this.resizer.setEnable(true);
  }

  apply(...component: ComponentInterface[]) {
    component.forEach(c => c.prepare())
  }


  // 开始绘制表格
  draw() {
    this.layer.removeChildren();
    this.colunmGroup.removeChildren();
    this.config.columns.forEach((column: ColumnInterface) => {
      const cellGroup = this.drawColumn(column);
      this.colunmGroup.add(cellGroup);
    })
    this.layer.add(this.colunmGroup);
    this.drawResizerLine();
  }


  // 绘制column
  drawColumn(column: ColumnInterface) {
    const cellGroup = new Konva.Group(
      { name: 'column_' + column.index }
    );
    const title = this.drawTitle(column);
    title.name('title_group')
    cellGroup.add(title);
    column.data.forEach((data: DataInterface) => {
      const cell = this.drawCell(column, data, title);
      cellGroup.add(cell);
    })
    cellGroup['column'] = cloneDeep(column);
    return cellGroup;
  }

  // 绘制单元格
  drawCell(column: ColumnInterface, data: DataInterface, title: Konva.Group) {
    const y = this.config.head.y + data.index[1] * this.config.height + title.height();
    const cell = this.createCell(column, y);
    cell.name('cell_group');
    cell['data'] = cloneDeep(data);
    this.emitter.emit(`render_${column.type}`, cell, data)
    return cell;
  }

  drawTitle(column: ColumnInterface) {
    const cell = this.createCell(column, this.config.head.y);
    const rect = cell.find('rect');
    console.log(rect);

    const text = creatText(column.title, cell.width() - 8);
    text.x(8);
    cell.add(text);

    cell.on('mouseover', () => {
      const rect = cell.find('Rect') as Konva.Rect[];
      rect[0].fill('#e8e9e9');
    })

    cell.on('mouseleave', () => {
      const rect = cell.find('Rect') as Konva.Rect[];
      rect[0].fill('transparent');
    })
    return cell;
  }

  private createCell(column: ColumnInterface, y: number) {
    const group = new Konva.Group();
    const cell = this.data_cell.clone();
    cell.width(column.width);
    cell.height(this.config.height);
    group.width(column.width);
    group.height(this.config.height);
    group.x(this.getColumnPosition(column.index));
    group.y(y);
    group.add(cell);
    return group;
  }

  drawResizerLine() {
    this.resizerGroup.removeChildren();
    const length = this.colunmGroup.children.length;
    this.colunmGroup.children.forEach((column: any) => {
      const columnData = column['column'];
      if (columnData.index < length - 1) {
        const resizer = new Konva.Rect({
          name: 'resizer',
          x: this.getColumnPosition(columnData.index) + columnData.width,
          y: this.config.head.y,
          fill: 'transparent',
          width: 3,
          height: this.config.height,
          offsetX: 2.5,
        });
        resizer['column_mapping'] = cloneDeep(columnData);
        this.resizerGroup.add(resizer);
      }
    })
    this.layer.add(this.resizerGroup)
  }

  resize = (column: ColumnInterface, width: number) => {
    width = Math.max(column.width + width, 80);
    this.config.columns[column.index].width = width;
    this.draw();
  }

  onselectCell = (rect: Konva.Node) => {
    if (rect.getAttr('name') !== 'cell_group') return;
    this.resizer.setEnable(false);
    this.wrapperManager.drawWrapperBaseOnCell(rect);
    this.emitter.emit(`focus_${rect.parent['column'].type}`, this.wrapperManager.wrapper, rect['data']);
  }

  private getColumnPosition(index: number) {
    let x = this.config.head.x;
    for (let i = 0; i <= index; i++) {
      if (i > 0) {
        x += this.config.columns[i - 1].width;
      }
    }
    return x;
  }
}