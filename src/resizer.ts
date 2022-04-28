import Konva from "konva";
import { Vector2d } from "konva/lib/types";

export class Resizer {
  resizerGroup: Konva.Group;
  resizer: Konva.Rect;
  status: string = 'init';
  mouseDown: MouseEvent;
  stage: Konva.Stage;
  start: number;
  enable: boolean = true;

  constructor(stage: Konva.Stage, resizerGroup: Konva.Group, resize: Function) {
    this.resizerGroup = resizerGroup;

    this.resizerGroup.on('mouseover', (e) => {
      if (!this.enable) return;
      if (e.target instanceof Konva.Rect) {
        document.body.style.cursor = 'col-resize'
        e.target.fill('#3370ff');
      }
    })

    this.resizerGroup.on('mouseleave', (e: any) => {
      if (e.target instanceof Konva.Rect && !this.resizer && !this.mouseDown) {
        document.body.style.cursor = 'default'
        e.target.fill('transparent');
      }
    })

    this.resizerGroup.on('mousedown', (e: any) => {
      if (!this.enable) return;
      if (e.target instanceof Konva.Rect) {
        this.resizer = e.target;
        this.start = this.resizer.getAttr('x');
        this.mouseDown = e.evt;
      }
    })

    stage.on('mouseup', (e: any) => {
      if (this.resizer) {
        const point = stage.getPointerPosition();
        const column = this.resizer['column_mapping'];
        const diff = point.x - this.start;
        resize(column, diff);
        this.resizer = undefined;
        this.mouseDown = undefined;
      }
    })

    stage.on('mousemove', (e: any) => {
      if (this.mouseDown) {
        const point = stage.getPointerPosition();
        const diff = point.x - this.start;
        this.resizer.x(diff + this.start);
      }
    })
  }

  setEnable(flag: boolean) {
    this.enable = flag;
  }
}