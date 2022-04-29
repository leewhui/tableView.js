import EventEmitter from "eventemitter3";
import Konva from "konva";
import { Group } from "konva/lib/Group";
import { ComponentInterface, DataInterface, setStateType } from "../type";
import { editableContainer } from "../wrapper";

export class LinkComponent implements ComponentInterface {
  emitter: EventEmitter;
  setState: setStateType;
  data: DataInterface;
  editor: HTMLDivElement;
  isEditable: boolean = true;

  constructor(setState: setStateType, emitter: EventEmitter) {
    this.setState = setState;
    this.emitter = emitter;
  }

  prepare = () => {
    this.emitter.on('focus_link', this.handleFocusLink)
    this.emitter.on('render_link', this.render);
  }

  handleFocusLink = (wrapper: HTMLElement, data: DataInterface) => {
    this.data = data;
    this.editor = editableContainer();
    this.editor.innerText = this.data.content;
    this.editor.style.color = '#437bff';
    this.editor.addEventListener('blur', this.handleBlur);
    wrapper.appendChild(this.editor);
  }

  handleBlur = (e: any) => {
    this.data.content = e.target.innerText;
    this.setState(this.data);
  }

  render = (cell: Group, data: DataInterface) => {
    const text = new Konva.Text({
      fontSize: 16,
      fontFamily: 'Times',
      text: data.content,
      offsetY: -16 / 2,
      maxWidth: cell.width() - 8,
      wrap: "none",
      ellipsis: true,
      fill: '#437bff',
    });

    text.on('mouseover', () => {
      text.textDecoration('underline');
    })

    text.on('mouseleave', () => {
      text.textDecoration('none');
    })

    text.on('mousedown', () => {
      window.open(`http://${text.text()}`);
    })
    text.x(8);
    cell.add(text);
  };
}