import Konva from "konva";
import EventEmitter from 'eventemitter3';
import { Vector2 } from "./type";

export class Selector {
  colunmGroup: Konva.Group;
  selectionBox: Konva.Group = new Konva.Group();
  selectionRect: Konva.Rect = new Konva.Rect();
  selectionCircel: Konva.Rect = new Konva.Rect({
    width: 6,
    height: 6,
    offset: {
      x: 3,
      y: 3,
    }
  });
  mouseState: string = 'init';
  mouseDown: MouseEvent;
  emitter: EventEmitter;
  container: HTMLDivElement;

  constructor(colunmGroup: Konva.Group, emitter: EventEmitter, container: HTMLDivElement) {
    this.colunmGroup = colunmGroup;
    this.container = container;
    this.emitter = emitter;
    this.selectionBox.add(this.selectionRect, this.selectionCircel);
    document.body.addEventListener('pointerdown', this.handleMouseDown, true)
  }

  handleMouseDown = (e: MouseEvent) => {
    const offsetLeft = this.container.offsetLeft;
    const offsetTop = this.container.offsetTop;
    const x = e.clientX - offsetLeft;
    const y = e.clientY - offsetTop;
    for (let i = 0; i < this.colunmGroup.children.length; i++) {
      const column = this.colunmGroup.children[i];
      if (column instanceof Konva.Group === false) continue;
      for (let j = 0; j < (column as unknown as Konva.Group).children.length; j++) {
        const cell = (column as unknown as Konva.Group).children[j];
        const selectedCell = this.findCellBaseOnPoint({ x, y }, cell);
        if (selectedCell) return this.emitter.emit('onselect', cell);
      }
    }
    this.emitter.emit('blur');
  }

  private findCellBaseOnPoint(point: Vector2, cell: Konva.Node): Konva.Group | null {
    if (cell instanceof Konva.Group === false) return null
    const { x, y } = point;
    if (x > cell.getAttr('x') && x <= cell.getAttr('x') + cell.getAttr('width')) {
      if (y > cell.getAttr('y') && y < cell.getAttr('y') + cell.getAttr('height')) {
        if (cell.getAttr('name') === 'cell_group') {
          return cell as Konva.Group;
        }
      }
    }
    return null;
  }

  handleMouseUp = () => {
    this.mouseState = 'init';
  }

  handleMouseMove = (e: any) => {
    if (this.mouseState === 'down') {
      const target = e.target;
      if (target instanceof Konva.Rect) {
        // target.fill('orange');
      }
    }
  }
}