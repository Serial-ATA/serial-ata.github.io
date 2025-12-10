+++
title = "Supassembler"
description = "A runtime assembler in Rust."

[extra]
type = "independent"
start_date = "Feb 2024"

# TODO
#[extra.socials]
#github = "https://github.com/Serial-ATA/supassembler"
#crates = "https://crates.io/crates/supassembler"
+++

A multi-ISA assembler in Rust.

-----

## The Problem

This project initially started as a part of my [JVM] to support its <abbr title="Just-In-Time">JIT</abbr> compiler.

The intention is to create an assembler API that:

* Abstracts away raw instruction encoding
* Uses Rust's type system to prevent invalid instruction operands, where possible
* Mimic the syntax of a standard assembler, like so:

```rust
static HELLO_WORLD: &'static CStr = c"Hello, World!";
static HELLO_WORLD_LEN: usize = HELLO_WORLD.count_bytes();

const STDOUT: i8 = 1;
const SYS_WRITE: i8 = 1;
const SYS_EXIT: i8 = 60;

let mut assembler = Assembler::new();

// Print hello world
assembler.mov(rdi, STDOUT);
assembler.mov(rsi, HELLO_WORLD);
assembler.mov(rdx, HELLO_WORLD_LEN);
assembler.mov(rax, SYS_WRITE);
assembler.syscall();

// Exit
assembler.mov(rdi, 0);
assembler.mov(rax, SYS_EXIT);
assembler.syscall();
```

-----

## Where It is Today

The project has since been decoupled from the [JVM], and operates as a standalone crate.

It currently supports *all* encodable `x86-64` instructions. I built a Python-based build system that parses the instruction
set provided by [Intel XED], and auto-generates the Rust code for instruction and register encodings.

-----

## Where It's Headed

### Multi-ISA Support

Right now, the assembler is exclusively `x86-64`. I plan to introduce more backends as more architectures are supported by
the [JVM], likely with `AArch64` coming next.

### Proc-macros

While purely aesthetic, I'm interested in creating macros to abstract the assembler away entirely, like so:

```rust
static HELLO_WORLD: &'static CStr = c"Hello, World!";
static HELLO_WORLD_LEN: usize = HELLO_WORLD.count_bytes();

const STDOUT: i8 = 1;
const SYS_WRITE: i8 = 1;
const SYS_EXIT: i8 = 60;

asm! {
    // Print hello world
    mov rdi, STDOUT;
    mov rsi, HELLO_WORLD;
    mov rdx, HELLO_WORLD_LEN;
    mov rax, SYS_WRITE;
    syscall;
    
    // Exit
    mov rdi, 0;
    mov rax, SYS_EXIT;
    syscall;
}
```

[JVM]: /projects/jvm
[Intel XED]: https://github.com/intelxed/xed