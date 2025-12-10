import { readFile, writeFile } from 'node:fs/promises';
import { Parser } from './parser';
import { Code } from "./code";

const main = async (args: string[]) => {
  const path = args[0];
  console.log(`input file is ${ path }`);

  const rawCodes = await readFile(path, 'utf-8');
  console.log(`rawCodes: ${ JSON.stringify(rawCodes) }`);

  const parser = new Parser(rawCodes);
  const code = new Code();

  let binLines = [];
  while (parser.hasMoreLine()) {
    parser.advance();
    let b = '';
    switch (parser.instructionType()) {
      case 'L_INSTRUCTION':
        // TODO impl;
        b = 'TODO';
        break;
      case 'C_INSTRUCTION':
        const c = code.comp(parser.comp());
        const d = code.dest(parser.dest());
        const j = code.jump(parser.jump());
        b = `111${ c }${ d }${ j }`;
        break;
      case 'A_INSTRUCTION':
        b = code.at(parser.at());
        break;
      default:
        throw new Error(`Unrecognized instruction type: ${ parser.instructionType() }`);
    }
    console.log(`binary code is ${ b }`);
    binLines.push(b);
  }

  const outputFile = path.split(".asm")[0] + ".hack";
  await writeFile(outputFile, binLines.join("\n"));
}

const args = process.argv.slice(2);
main(args).then();