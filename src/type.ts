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

export type setStateType = (data: DataInterface) => void;
export interface ComponentInterface {
  setState: setStateType;
  prepare: () => void;
  render: Function;
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

    columns.push({
      type: 'text',
      index: i,
      width: 180,
      data
    })
  }
  return columns;
}

export const defaultConfig = {
  height: 30,
  head: { x: 100, y: 100 },
  tail: { x: 0, y: 0 },
  columns: createDefaultConfig(),
}