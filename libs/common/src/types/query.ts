export interface SkipQuery {
  skip?: number;
}

export interface TakeQuery {
  take?: number;
}

export interface CountQuery {
  [key: string]:
    | number
    | string
    | boolean
    | number[]
    | string[]
    | boolean[]
    | undefined;
}

export interface IIncludeQuery {
  include?: string[];
  extractInclude(): any;
}

export class IncludeQuery implements IIncludeQuery {
  include?: string[];
  constructor(include?: string[]) {
    this.include = include;
  }
  extractInclude() {
    if (!this.include) return undefined;

    return this.include.reduce((obj, curr) => {
      obj[curr] = true;
      return obj;
    }, {});
  }
}
