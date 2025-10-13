// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/4/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)
// The algorithm is based on repetitive addition.

//// Replace this comment with your code.
    // R2=0
	@0
	D=A
	@R2
	M=D
	// n=R1
	@R1
	D=M
	@n
	M=D
(LOOP)
    // if (n == 0) goto @END;
	@n
	D=M
	@END
	D;JEQ
	// R2 += R0
	@R0
	D=M
	@R2
	M=D+M
	// n -= 1
	@n
	D=M
	@1
	D=D-A
	@n
	M=D
	// jump to
	@LOOP
	0;JMP
(END)
	@END
	0;JMP