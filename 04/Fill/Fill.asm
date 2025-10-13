// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/4/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel. When no key is pressed,
// the screen should be cleared.

//// Replace this comment with your code.
(START)
    // COLOR=0
    @0
    D=A
    @COLOR
    M=D
	// if (KBD == 0) goto @RENDER;
    @KBD
    D=M
    @RENDER
    D;JEQ
	// COLOR=-1
	@COLOR
	M=-1
(RENDER)
    // n=0
    @0
    D=A
    @n
    M=D
(LOOP)
    // if (n - 8192 == 0) goto @START; 
    @n
	D=M
    @8192
	D=D-A
    @START
	D;JEQ
	// ADDR = (SCREEN + n)
	@n
	D=M
	@SCREEN
	D=D+A
    @ADDR
    M=D
	// *(ADDR) = COLOR
	@COLOR
	D=M
	@ADDR
	A=M
	M=D
	// n += 1
	@1
	D=A
	@n
	M=D+M
	@LOOP
	0;JMP
	
	
	
	
    