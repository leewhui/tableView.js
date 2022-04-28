import EventEmitter from "eventemitter3";
import Konva from "konva";
import { ComponentInterface, DataInterface, setStateType } from "../type";

export class TextComponent implements ComponentInterface {
  setState: setStateType;
  emitter: EventEmitter;
  editor: HTMLDivElement;
  data: DataInterface;

  constructor(setState: setStateType, emitter: EventEmitter) {
    this.setState = setState;
    this.emitter = emitter;
  }

  prepare = () => {
    this.emitter.on('focus_text', this.handleFocusText)
    this.emitter.on('render_text', this.render);
    this.emitter.on('blur', () => this.editor.blur());
  }

  handleFocusText = (wrapper: HTMLElement, data: DataInterface) => {
    this.data = data;
    this.editor = document.createElement('div');
    this.editor.innerText = this.data.content;
    this.editor.style.minHeight = '100%';
    this.editor.contentEditable = 'true';
    this.editor.style.outline = 'none';
    this.editor.style.border = '2px solid #3370ff';
    this.editor.style.backgroundColor = 'white';
    this.editor.style.boxSizing = 'border-box';
    this.editor.style.lineHeight = `28px`;
    this.editor.style.padding = '0 5px';
    this.editor.addEventListener('blur', this.handleBlur)
    wrapper.append(this.editor);
  }

  handleBlur = (e: any) => {
    this.data.content = e.target.innerText;
    console.log(e);

    this.setState(this.data);
  }
  render = (cell: Konva.Group, data: DataInterface) => {
    const text = new Konva.Text({
      fontSize: 16,
      fontFamily: 'Times',
      text: data.content,
      offsetY: -16 / 2,
      width: cell.width() - 8,
      wrap: "none",
      ellipsis: true,
    });
    text.x(8);
    cell.add(text);
  };
}