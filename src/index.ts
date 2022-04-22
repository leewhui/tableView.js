import Konva from 'konva';
import { ColumnInterface, DataInterface, TableInterface } from './type';
import { createWrapper } from './wrapper';

export class TableView {
  container: HTMLDivElement;
  stage: Konva.Stage;
  layer: Konva.Layer;
  cellGroup: Konva.Group = new Konva.Group({ name: 'cellGroup' });
  config: TableInterface;
  wrapper: HTMLDivElement;
  data_cell = new Konva.Rect({
    fill: 'white',
    name: 'data_cell',
    stroke: '#dee0e3',
    strokeWidth: 1.5,
  })

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
    this.draw();
  }

  setState(data: DataInterface) {

  }

  draw() {
    this.config.columns.forEach((column: ColumnInterface) => {
      const group = new Konva.Group({ name: 'column_' + column.index });
      column.data.forEach((data: DataInterface) => {
        const cell = this.data_cell.clone();
        cell.width(column.width);
        cell.height(this.config.height);
        
        cell.x(this.config.head.x + data.index[0] * column.width);
        cell.y(this.config.head.y + data.index[1] * this.config.height);
        group.add(cell)
      })
      this.cellGroup.add(group);
    })

    this.layer.add(this.cellGroup);
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