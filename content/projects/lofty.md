+++
title = "Lofty"
description = "An audio metadata library written in Rust that supports all major audio formats."
[extra]
type = "independent"
start_date = "Dec 2020"

[extra.socials]
github = "https://github.com/Serial-ATA/lofty-rs"
crates = "https://crates.io/crates/lofty"
docsrs = "https://docs.rs/lofty"
+++

`Lofty` is a comprehensive, production-ready audio metadata crate. It was created to solve a critical gap in the Rust ecosystem, which previously lacked a single, reliable crate for handling the myriad of complex audio formats and their metadata standards.

-----

## The Problem

Back in 2019, I just wanted to build an [ncmpcpp]-inspired music player in Rust. Unfortunately, to handle metadata, I ended up having to glue together a bunch of format-specific crates (one for WAV, another for FLAC, etc.). That introduced a few problems:

* The dependency list *blew up*
* I needed to know all of the format-specific field names
* Whenever I needed access to another field, I would need to update the logic for *all* supported formats

So, I started Lofty as a hobby: I wanted to build the one library that would handle all of it. It gives you a single, clean
API to read and write metadata (ID3, Vorbis comments, APE, etc.) and get audio properties (duration, bitrate) from pretty
much any major audio format (MP3, FLAC, WAV, etc.).

The whole point is to make it simple for the developer. They can pass in any file and Lofty figures it all out, handing
them back a simple abstract `Tag` that they can query for information such as the artist or title. All of that without needing
to know the format of the file they initially passed in.

-----

## Architecture

The most important design decision in the entire project was decoupling the metadata from the physical file, via the abstract `Tag` type.

Unlike most libraries I'd seen, where a tag is intrinsically linked to its source file, I designed the `Tag` as an
independent, portable data structure.

This made complex workflows pretty simple. A developer can, for example, read a `Tag` from an MP3, modify it in memory, and
write it directly to a FLAC file without writing any format-specific translation logic. It makes tasks like library migrations
or batch updates trivial.

-----

## The Unfortunate State of Audio

It turns out the digital audio world is a complete mess. Lofty was originally a fully spec-compliant parser, but that doesn't
work in the real world.

I've spent countless hours reverse-engineering files created by other popular software, finding all the weird ways they
were broken, and then implementing hacks and workarounds in my parsers to handle them.

But that introduces another issue: hiding potential errors from the users. Not every user will *want* the parser to guess
their intent. So, I eventually introduced a set of parsing modes to give that control to developers:

* Strict: For purely spec-compliant files. It will eagerly error on any non-spec-compliant input.
* BestAttempt (Default): This is the mode for 99% of users. It tries to recover from errors (like bad text encoding) by filling in blanks (e.g., an empty string or a 0) without failing the whole parse.
* Relaxed: This is the most aggressive mode. It will discard any field it can't read and just return the best partial tag it can from even the most mangled files.

-----

## Where It is Today

It's now used in over 400 public GitHub projects and over 40 published crates, and has crossed one million downloads
on [crates.io]. It's been amazing to see it grow over the years.

[ncmpcpp]: https://github.com/ncmpcpp/ncmpcpp
[crates.io]: https://crates.io
