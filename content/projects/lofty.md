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

A crate to handle reading and writing audio metadata in a generic, unified way.

# Supported Formats

See the table at https://github.com/Serial-ATA/lofty-rs/blob/main/lofty/SUPPORTED_FORMATS.md.

# Usage

It can be used in two ways:

## Generic

Lofty provides a generic `Tag` type that all metadata formats can be converted into. It allows you to no longer have to think of the underlying format (ID3v2, Vorbis Comments, etc.).

This means that reading a file for simple tasks (e.g. getting the title, artist, and album for a music player) can simply be done with the following:

```rust
let file = lofty::read_from_path("path/to/file.mp3")?;

let tag = match tagged_file.primary_tag() {
    Some(primary_tag) => primary_tag,
    // If the "primary" tag doesn't exist, we just grab the
    // first tag we can find. Realistically, a tag reader would likely
    // iterate through the tags to find a suitable one.
    None => tagged_file.first_tag().expect("ERROR: No tags found!"),
};

let title = tag.title();
let artist = tag.artist();
let album = tag.album();
```

And that's all!

## Concrete Formats

Of course, some formats (such as ID3v2) have lots of niche features, that can't be exposed in the generic API. That's where you can reach for concrete types:

```rust
use lofty::mpeg::MpegFile;

let file = MpegFile::read_from_path("path/to/file.mp3")?;
let id3v2_tag = file.id3v2_tag().unwrap();

let title = id3v2_tag.title();
```

Regardless of the path you choose (generic or concrete), the types can easily be converted to each other:

```rust
let generic_tag: Tag = /* ... */
let concrete_tag: Id3v2Tag = generic_tag.into();

// Then...
let generic_tag: Tag = concrete_tag.into();
```
