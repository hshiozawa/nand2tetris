import { Symbol } from "./parser";

export type Address = number;

const PREDEFINED_SYMBOLS: { [key in Symbol]: number } = {
  'R0': 0,
  'R1': 1,
  'R2': 2,
  'R3': 3,
  'R4': 4,
  'R5': 5,
  'R6': 6,
  'R7': 7,
  'R8': 8,
  'R9': 9,
  'R10': 10,
  'R11': 11,
  'R12': 12,
  'R13': 13,
  'R14': 14,
  'R15': 15,
  'SP': 0,
  'LCL': 1,
  'ARG': 2,
  'THIS': 3,
  'THAT': 4,
  'SCREEN': 16384,
  'KBD': 24576
};

const START_ADDRESS: Address = 16;

export class SymbolTable {
  private readonly table: Map<Symbol, Address> = new Map();
  private currentRam: Address = START_ADDRESS;

  constructor() {
    Object.entries(PREDEFINED_SYMBOLS)!.forEach(([key, value]) => {
      this.table.set(key as Symbol, value);
    });
  }

  addEntry(symbol: Symbol, address: Address) {
    console.log(`addEntry (${ symbol }, ${ address })`);
    this.table.set(symbol, address);
  }

  addSymbol(symbol: Symbol) {
    console.log(`addSymbol (${ symbol }, ${ this.currentRam })`);
    this.table.set(symbol, this.currentRam++)
  }

  contains(symbol: Symbol): boolean {
    return this.table.has(symbol);
  }

  getAddress(symbol: Symbol): Address {
    const val = this.table.get(symbol);
    console.log(`getAddr (${ symbol }, ${ val })`);
    return val;
  }

  dump() {
    console.log('Symbol Table Dump:');
    this.table.forEach((v, k, kow) => {
      console.log(`${ k } -> ${ v }`);
    });
  }
}