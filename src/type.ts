import EventEmitter from "eventemitter3";
import Konva from "konva";
import { Vector2d } from "konva/lib/types";

export interface DataInterface {
  content: string;
  index: number[];
}

export interface ColumnInterface {
  type: string;
  title: string;
  index: number;
  width: number;
  data: DataInterface[];
}

export interface TableInterface {
  height: number;
  head: Vector2d;
  tail: Vector2d;
  columns: ColumnInterface[];
}

export type setStateType = (data: DataInterface) => void;
export interface ComponentInterface {
  emitter: EventEmitter;
  setState: setStateType;
  prepare: () => void;
  render: (cell: Konva.Group, data: DataInterface) => void;
}

export function createDefaultConfig() {
  const columns: ColumnInterface[] = [];
  for (let i = 0; i < 3; i++) {
    const data: DataInterface[] = [];
    for (let j = 0; j < 3; j++) {
      data.push({
        content: '',
        index: [i, j]
      })
    }

    if (i === 1) {
      columns.push({
        type: 'text',
        title: '🔥 多行文本',
        index: i,
        width: 180,
        data
      })
    } else {
      columns.push({
        type: 'link',
        title: '🍉 链接',
        index: i,
        width: 180,
        data
      })
    }
  }
  return columns;
}

export const defaultConfig = {
  height: 30,
  head: { x: 100, y: 100 },
  tail: { x: 0, y: 0 },
  columns: createDefaultConfig(),
}