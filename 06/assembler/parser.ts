export type Instruction = 'A_INSTRUCTION' | 'C_INSTRUCTION' | 'L_INSTRUCTION';
export type Symbol = string;
export type Dest = string;
export type Comp = string;
export type Jump = string;
export type At = string;

export class Parser {
  private readonly lines: string[];
  private readonly endLineNum: number;

  private currentLineNum: number;
  private currentLine: string;

  private symbolVal: Symbol = null;
  private destVal: Dest = null;
  private compVal: Comp = null;
  private jumpVal: Jump = null;
  private atVal: At = null;

  constructor(rawCode: string) {
    this.lines = rawCode.split("\n").map(line => line.replace(/\s/g, "")).filter(line => line.length > 0);
    this.currentLineNum = -1;
    this.endLineNum = this.lines.length - 1;
  }

  public hasMoreLine(): boolean {
    return this.currentLineNum + 1 <= this.endLineNum;
  }

  public advance(): void {
    if (!this.hasMoreLine()) {
      throw new Error(`No more lines available.`);
    }

    do {
      this.currentLineNum++;
      this.currentLine = this.lines[this.currentLineNum];
      console.log(`current: '${ this.currentLine }' (L${ this.currentLineNum - 1 }, E:${ this.endLineNum })`);
    } while (this.currentLine.length === 0 || this.currentLine.startsWith("//"));

    switch (this.instructionType()) {
      case 'L_INSTRUCTION':
        this.parseSymbol();
        break;
      case 'C_INSTRUCTION':
        this.parseComp();
        break;
      case 'A_INSTRUCTION':
        this.parseAt();
        break;
      default:
        throw new Error(`Unrecognized line: ${ this.currentLine }`);
    }
  }

  public instructionType(): Instruction {
    const line = this.currentLine;
    if (line.startsWith('@')) {
      return 'A_INSTRUCTION'
    } else if (line.startsWith('(')) {
      return 'L_INSTRUCTION'
    } else if (line.length > 0) {
      return 'C_INSTRUCTION'
    }
    return null;
  }

  private parseSymbol(): void {
    const line = this.currentLine;
    const matches = line.match(/\((.*)\)/);
    if (matches.length > 1) {
      this.symbolVal = matches[1];
      console.log(`parsed symbol val: ${ this.symbolVal }`);
    } else {
      throw new Error('Symbol is not found.');
    }
  }

  public symbol(): Symbol {
    if (this.instructionType() !== 'L_INSTRUCTION') {
      throw new Error('Instruction type must be an L_INSTRUCTION');
    }

    return this.symbolVal;
  }

  private parseComp(): void {
    if (this.instructionType() !== 'C_INSTRUCTION') {
      throw new Error('Instruction type must be an C_INSTRUCTION');
    }

    const line = this.currentLine;
    const split = line.split(/[=;]/);
    if (split.length === 3) {
      this.destVal = split[0];
      this.compVal = split[1];
      this.jumpVal = split[2];
    } else if (split.length === 2) {
      if (line.includes('=')) {
        this.destVal = split[0];
        this.compVal = split[1];
        this.jumpVal = 'null';
      } else {
        this.destVal = 'null';
        this.compVal = split[0];
        this.jumpVal = split[1];
      }
    } else if (split.length === 1) {
      this.destVal = 'null';
      this.compVal = split[0];
      this.jumpVal = 'null';
    } else {
      throw new Error(`line is invalid C_INSTRUCTION: ${ line }`);
    }
    console.log(`parsed dest: ${ this.destVal }, comp: ${ this.compVal }, jump: ${ this.jumpVal }`);
  }

  public dest(): Dest {
    return this.destVal;
  }

  public comp(): Comp {
    return this.compVal;
  }

  public jump(): Jump {
    return this.jumpVal;
  }

  private parseAt(): void {
    if (this.instructionType() !== 'A_INSTRUCTION') {
      throw new Error('Instruction type must be an A_INSTRUCTION');
    }

    this.atVal = this.currentLine.slice(1);
    console.log(`parsed at val: ${ this.atVal }`);
  }

  public at(): At {
    return this.atVal;
  }
}