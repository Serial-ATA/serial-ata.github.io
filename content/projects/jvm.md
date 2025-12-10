+++
title = "JVM"
description = "A from-scratch implementation of the Java Virtual Machine, Java SE 25 Edition."

[extra]
type = "independent"
start_date = "Oct 2022"

[extra.socials]
github = "https://github.com/Serial-ATA/jvm"
+++

A from-scratch Java Virtual Machine (and accompanying tools) in Rust.

-----

## The Problem

Back in 2022, I found out that the JVM is actually fully specified, and as someone interested in the language, I wanted to see if I could understand it enough to create a JVM of my own.

It started as a small experiment: could I write a `.class` file parser? That experiment took off. I ended up spending years building everything: the class loader, the bytecode interpreter, reimplementing the native libraries, etc.

This is a complete, from-scratch JVM. It uses nothing from [OpenJDK] except for the standard classes file. I even recreated the entire java CLI and built my own Rust crates for handling `JImage` and `JMod` files.

-----

## Where It is Today

The JVM is capable of quite a bit today, it can:

* Complete all 3 init stages of [OpenJDK]
* Handle Java modules
* Run basic apps like hello world

And it does so quite quickly, despite currently being fully interpreted.

-----

## Where It's Headed

### Fully Implement the JNI

A decent chunk of it has been implemented so far, with new methods being added as-needed.

### Remove All Runtime Dependencies

I've always wanted to make the JVM have zero dependencies, with the exception of `std` and `libc`. Periodically, I'll
choose a crate to remove, and reimplement the functionality I need from scratch. Obviously, this makes the project significantly
more complex, but I'm interested in owning the entire stack and understanding every detail of the process.

[OpenJDK]: https://openjdk.org/projects/jdk/
[JNI]: https://en.wikipedia.org/wiki/Java_Native_Interface
[Supassembler]: /projects/supassembler
