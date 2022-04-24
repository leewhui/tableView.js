import Konva from 'konva';
import { Resizer } from './resizer';
import { Selector } from './selection';
import { ColumnInterface, DataInterface, TableInterface } from './type';
import { createWrapper } from './wrapper';
import { cloneDeep } from 'lodash';

export class TableView {
  container: HTMLDivElement;
  stage: Konva.Stage;
  layer: Konva.Layer;
  cellGroup: Konva.Group = new Konva.Group({ name: 'cellGroup' });
  colunmGroup: Konva.Group = new Konva.Group();
  resizerGroup: Konva.Group = new Konva.Group({ name: 'resizer group' });
  config: TableInterface;
  wrapper: HTMLDivElement;
  data_cell = new Konva.Rect({
    fill: 'white',
    name: 'data_cell',
    stroke: '#dee0e3',
    strokeWidth: 1.5,
  })
  selector: Selector;
  resizer: Resizer;

  constructor(container: HTMLDivElement, config?: TableInterface) {
    this.container = container;

    this.stage = new Konva.Stage({
      container: this.container,
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    });

    this.layer = new Konva.Layer();
    this.wrapper = createWrapper();

    if (!config) {
      this.config = {
        height: 30,
        head: { x: 100, y: 100 },
        tail: { x: 0, y: 0 },
        columns: this.createDefaultConfig(),
      }
    } else {
      this.config = config;
    }

    this.stage.add(this.layer);
    this.selector = new Selector(this.layer);
    this.resizer = new Resizer(this.stage, this.resizerGroup, this.resize);
    this.draw();
  }

  setState(data: DataInterface) {

  }

  draw() {
    this.layer.removeChildren();
    this.colunmGroup.removeChildren();
    // let cacheWidth = 0;
    this.config.columns.forEach((column: ColumnInterface) => {
      const cellGroup = new Konva.Group(
        { name: 'column_' + column.index }
      );
      // const title = this.drawTitle(column);
      column.data.forEach((data: DataInterface, index: number) => {
        const cell = this.data_cell.clone();
        cell.width(column.width);
        cell.height(this.config.height);
        cell.x(this.getColumnPosition(column.index));
        cell.y(this.config.head.y + data.index[1] * this.config.height);
        cell['data'] = cloneDeep(data);
        cellGroup.add(cell);
      })
      // cacheWidth += column.width;
      // cellGroup.add(title);
      cellGroup['column'] = cloneDeep(column);
      this.colunmGroup.add(cellGroup);
    })
    this.layer.add(this.colunmGroup);
    this.drawResizerLine();
  }

  drawTitle(column: ColumnInterface) {
    const cell = this.data_cell.clone();
    cell.width(column.width);
    cell.height(this.config.height);
    cell.x(this.config.head.x + column.index * column.width)
    cell.y(this.config.head.y)
    return cell;
  }

  drawResizerLine() {
    this.resizerGroup.removeChildren();
    const length = this.colunmGroup.children.length;
    this.colunmGroup.children.forEach((column: any, index: number) => {
      const columnData = column['column'];
      if (columnData.index < length - 1) {
        const resizer = new Konva.Rect({
          name: 'resizer',
          x: this.getColumnPosition(columnData.index) + columnData.width,
          y: this.config.head.y,
          fill: 'transparent',
          width: 3,
          height: this.config.height * (this.config.columns.length + 1),
          offsetX: 2.5,
        });
        resizer['column_mapping'] = cloneDeep(columnData);
        this.resizerGroup.add(resizer);
      }
    })
    this.layer.add(this.resizerGroup)
  }

  resize = (column: ColumnInterface, width: number) => {
    column.width = Math.max(column.width + width, 80);
    this.config.columns[column.index] = column;
    this.draw();
  }

  private getColumnPosition(index: number) {
    let x = this.config.head.x;
    for (let i = 0; i <= index; i++) {
      if (i > 0) {
        x += this.config.columns[i - 1].width;
      }
    }
    console.log(x);
    return x;
  }

  private createDefaultConfig() {
    const columns: ColumnInterface[] = [];
    for (let i = 0; i < 3; i++) {
      const data: DataInterface[] = [];
      for (let j = 0; j < 3; j++) {
        data.push({
          content: '',
          index: [i, j]
        })
      }

      columns.push({
        type: 'text',
        index: i,
        width: 180,
        data
      })
    }
    return columns;
  }
}