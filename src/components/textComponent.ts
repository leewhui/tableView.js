import EventEmitter from "eventemitter3";
import Konva from "konva";
import { ComponentInterface, DataInterface, setStateType } from "../type";
import { creatText, editableContainer } from "../wrapper";

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
  }

  handleFocusText = (wrapper: HTMLElement, data: DataInterface) => {
    this.data = data;
    this.editor = editableContainer();
    this.editor.innerText = this.data.content;
    this.editor.addEventListener('blur', this.handleBlur)
    wrapper.append(this.editor);
  }

  handleBlur = (e: any) => {
    this.data.content = e.target.innerText;
    this.setState(this.data);
  }
  render = (cell: Konva.Group, data: DataInterface) => {
    const text = creatText(data.content, cell.width() - 8);
    text.x(8);
    cell.add(text);
  };
}