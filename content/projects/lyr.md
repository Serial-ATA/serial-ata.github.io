+++
title = "lyr"
description = "A tool to download and embed lyrics from multiple sources."

[extra]
start_date = "Jul 2022"
end_date = "Jan 2023"

[extra.socials]
github = "https://github.com/Serial-ATA/lyr"
crates = "https://crates.io/crates/lyr"
+++

A CLI tool to download song lyrics from multiple sources, and optionally embed them into audio files.

## Sources

The following sources are supported:

* [AZLyrics](https://azlyrics.com)
* [Genius](https://genius.com)
* [JahLyrics](https://jah-lyrics.com)
* [Musixmatch](https://www.musixmatch.com)

## Usage

Print the lyrics to stdout:

```console
$ lyr --artist="Lynyrd Skynyrd" --title="Free Bird"
```

Output the lyrics to a file:
```console
$ lyr --artist="Lynyrd Skynyrd" --title="Free Bird" lyrics.txt
```

Determine the artist and title from a file, and embed the lyrics into it:

```console
$ lyr --input="some-music-file.mp3"
```
