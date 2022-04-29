import Konva from "konva";
import EventEmitter from 'eventemitter3';

export class Selector {
  mouseState: string = 'init';
  mouseDown: MouseEvent;
  emitter: EventEmitter;
  stage: Konva.Stage;
  container: HTMLDivElement;
  cellGroup: Konva.Group;

  constructor(stage: Konva.Stage, emitter: EventEmitter, container: HTMLDivElement, cellGroup: Konva.Group) {
    this.stage = stage;
    this.cellGroup = cellGroup;
    this.emitter = emitter;
    this.container = container;
    this.stage.on('mousedown', this.handleMouseDown)
    document.addEventListener('mousedown', this.handleDocumentClick);
  }

  handleMouseDown = (e: any) => {
    if (e.target instanceof Konva.Stage) {
      return this.emitter.emit('blur');
    }
    if (e.target.parent.getAttr('name') === 'cell_group') {
      return this.emitter.emit('onselect', e.target.parent);
    } else {
      this.emitter.emit('blur');
    }
  }

  handleDocumentClick = (e: MouseEvent) => {
    const x = e.offsetX;
    const y = e.offsetY;
    const offsetLeft = this.container.offsetLeft;
    const offsetTop = this.container.offsetTop;
    if (x < offsetLeft || y < offsetTop) {
      this.emitter.emit('blur')
    } else if (x > offsetLeft + this.container.clientWidth || y > offsetTop + this.container.clientHeight) {
      this.emitter.emit('blur')
    }
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