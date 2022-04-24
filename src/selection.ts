import Konva from "konva";

export class Selector {
  layer: Konva.Layer;
  selectionBox: Konva.Group = new Konva.Group();
  selectionRect: Konva.Rect = new Konva.Rect();
  selectionCircel: Konva.Rect = new Konva.Rect({
    width: 6,
    height: 6,
    fill: '#3370ff',
    offset: {
      x: 3,
      y: 3,
    }
  });
  mouseState: string = 'init';
  mouseDown: MouseEvent;

  constructor(layer: Konva.Layer) {
    this.layer = layer;
    this.selectionBox.add(this.selectionRect, this.selectionCircel);
    this.layer.on('mousedown', this.handleMouseDown)
    this.layer.on('mouseup', this.handleMouseUp);
    this.layer.on('mousemove', this.handleMouseMove);
  }

  handleMouseDown = (e: any) => {
    const rect = e.target;
    if (rect instanceof Konva.Rect && rect['data']) {
      this.mouseState = 'down';
      this.selectionRect.x(rect.x());
      this.selectionRect.y(rect.y());

      this.selectionCircel.x(rect.x() + rect.width());
      this.selectionCircel.y(rect.y() + rect.height());

      this.selectionRect.width(rect.width());
      this.selectionRect.height(rect.height());

      this.selectionRect.stroke('#3370ff');
      this.mouseDown = e.evt;

      this.layer.add(this.selectionBox);
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