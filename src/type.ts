export type Vector2 = {
  x: number;
  y: number;
}

export interface DataInterface {
  content: string;
  index: number[];
}

export interface ColumnInterface {
  type: string;
  index: number;
  width: number;
  data: DataInterface[];
}

export interface TableInterface {
  height: number;
  head: Vector2;
  tail: Vector2;
  columns: ColumnInterface[];
}

export interface ComponentInterface {
  setState: (data: DataInterface) => void;
  prepare: (data: DataInterface, wrapper: HTMLDivElement) => void;
  render: Function;
}

