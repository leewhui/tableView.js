import Konva from "konva";

export class Wrapper {
  wrapper: HTMLDivElement;
  container: HTMLDivElement;

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.wrapper = document.createElement('div');
    this.wrapper.style.width = '0px';
    this.wrapper.style.height = '0px';
    this.wrapper.style.position = 'absolute';
    this.wrapper.style.outline = 'none';
    this.wrapper.style.border = 'none';
    this.wrapper.style.boxSizing = 'border-box';
  }

  drawWrapperBaseOnCell(rect: Konva.Node) {
    this.wrapper.innerHTML = '';
    const offset = { x: rect.x(), y: rect.y() }
    const width = rect.getAttr('width');
    const height = rect.getAttr('height');
    const left = this.container.offsetLeft;
    const right = this.container.offsetTop;
    this.wrapper.style.left = offset.x + left + 'px';
    this.wrapper.style.top = offset.y + right + 'px';
    this.wrapper.style.width = `${width}px`;
    this.wrapper.style.height = `${height}px`;
  }

  resetWrapper() {
    this.wrapper.innerHTML = '';
    this.wrapper.style.width = '0px';
    this.wrapper.style.height = '0px';
  }
}

export function editableContainer(): HTMLDivElement {
  const editor = document.createElement('div');
  editor.style.minHeight = '100%';
  editor.contentEditable = 'true';
  editor.style.outline = 'none';
  editor.style.border = '2px solid #3370ff';
  editor.style.backgroundColor = 'white';
  editor.style.boxSizing = 'border-box';
  editor.style.lineHeight = `28px`;
  editor.style.padding = '0 5px';
  return editor;
}

export function creatText(content: string, width: number): Konva.Text {
  const text = new Konva.Text({
    fontSize: 16,
    fontFamily: 'Times',
    text: content,
    offsetY: -16 / 2,
    width: width,
    wrap: "none",
    ellipsis: true,
  });
  return text;
}