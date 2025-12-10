import { readFile, writeFile } from 'node:fs/promises';
import { Parser, Symbol } from './parser';
import { Code } from "./code";
import { Address, SymbolTable } from "./symbolTable";


const main = async (args: string[]) => {
  const path = args[0];
  const rawCodes = await readFile(path, 'utf-8');

  const symbolTable = new SymbolTable();

  firstPass(rawCodes, symbolTable);
  const outputs = secondPass(rawCodes, symbolTable);

  const outputFile = path.split(".asm")[0] + ".hack";
  await writeFile(outputFile, outputs.join("\n"));
}

const firstPass = (rawCodes: string, symbolTable: SymbolTable) => {
  const parser = new Parser(rawCodes);

  let instruction = 0;
  while (parser.hasMoreLine()) {
    parser.advance();

    if (parser.instructionType() === 'L_INSTRUCTION') {
      const symbol: Symbol = parser.symbol();
      symbolTable.addEntry(symbol, instruction);
    } else {
      instruction++;
    }
  }
}

const secondPass = (rawCodes: string, symbolTable: SymbolTable) => {
  const parser = new Parser(rawCodes);
  const code = new Code();

  let binCodes = [];
  while (parser.hasMoreLine()) {
    parser.advance();
    let bin = '';
    switch (parser.instructionType()) {
      case 'C_INSTRUCTION':
        const c = code.comp(parser.comp());
        const d = code.dest(parser.dest());
        const j = code.jump(parser.jump());
        bin = `111${ c }${ d }${ j }`;
        break;
      case 'A_INSTRUCTION':
        const atVal = parser.at();
        const resolved = resolveSymbol(atVal, symbolTable);
        bin = code.address(resolved);
        break;
      case 'L_INSTRUCTION':
        continue;
      default:
        throw new Error(`Unrecognized instruction type: ${ parser.instructionType() }`);
    }
    binCodes.push(bin);
  }

  return binCodes;
}

const resolveSymbol = (atVal: string, symbolTable: SymbolTable): Address => {
  const n = Number.parseInt(atVal);
  if (isNaN(n)) {
    if (!symbolTable.contains(atVal)) {
      symbolTable.addSymbol(atVal);
    }
    return symbolTable.getAddress(atVal);
  }
  return n;
}

const args = process.argv.slice(2);
main(args).then();