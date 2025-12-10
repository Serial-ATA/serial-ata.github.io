+++
title = "MTP"
description = "An implementation of MTP over USB in Rust"

[extra]
type = "independent"
start_date = "Aug 2024"

[extra.socials]
github = "https://github.com/Serial-ATA/mtp"
crates = "https://crates.io/crates/mtp"
+++

A pure-Rust implementation of <abbr title="Media Transfer Protocol">MTP</abbr>

-----

## The Problem

### What is MTP?

<abbr title="Media Transfer Protocol">MTP</abbr> is a generic protocol allowing different mobile devices (e.g. smartphones, tablets, cameras)
to perform different operations, primarily sending and receiving files.

An MTP session simply consists of:

* Sending operations and their data, and waiting for responses
* Handling interrupts from the device
    * At any time, the device can send events, notifying the user of any updates to the device's state (e.g. a file was deleted)

*For more details, check out the [Wikipedia Article]*

### What This Crate Does

This crate tries to provide the simplest API for interacting with MTP devices. Here's an example program that will find
all connected MTP-eligible USB devices and print out their storage devices.

```rust
async fn print_all_storages() -> mtp::error::Result<()> {
  // Discover all MTP-eligible devices
  let mut all_mtp_devices = mtp::usb:device_list()?;
  for maybe_device in all_mtp_devices {
    let device = maybe_device?;

    println!(
      "Storages for device '{:?}':",
      device.info().product_string()
    );
    
    // Open a new session
    let (mut handle, session_id) = device.open().await?;
  
    // Perform operations within the session
    // (fetching all storage descriptors)
    let all_storages = handle.storages(session_id).await?;

    for storage in all_storages {
      println!(
        "{} ({}/{} bytes free)",
        storage.description.unwrap_or(String::from("Unnamed")),
        storage.free_space,
        storage.max_capacity
      )
    }
  }

  Ok(())
}
```

-----

## Architecture

The project is made up of two crates: `mtp` and `mtp_spec`

### The Protocol Layer (`mtp_spec`)

`mtp_spec` is a `#![no_std]` implementation of all <abbr title="Media Transfer Protocol">MTP</abbr> structures, operations,
responses, and events.

### The Transport Layer (`mtp`)

`mtp` provides the actual USB transport layer (device discovery, USB packet encoding/decoding).

#### Transport Implementations

While MTP is traditionally used over USB, I designed the `mtp_spec` crate to be transport-agnostic via the `PtpIo` trait.
This allows users to (almost trivially) implement alternative transport layers (e.g. Wi-Fi) by implementing the following:

```rust
pub trait PtpIo: Send {
  /// Implementation-specific errors that can occur during I/O operations
  type Error: core::error::Error + From<MtpError>;
  /// Implementation-specific event stream, see [`Self::event_stream()`]
  type EventStream: Stream<Item = Result<Event, Self::Error>>;

  /// Get the next transaction ID
  ///
  /// While not required, the resulting ID **should** be used in the next operation, to keep the
  /// transaction IDs monotonically increasing.
  #[must_use]
  fn next_transaction_id(&mut self) -> TransactionId;
  /// Get the next session ID
  ///
  /// While not required, the resulting ID **should** be used in the next operation, to keep the
  /// session IDs monotonically increasing.
  #[must_use]
  fn next_session_id(&mut self) -> SessionId;
  /// Get the endianness of the current device
  ///
  /// The value of this is expected to be consistent for the duration of the session.
  fn endian(&self) -> Endian;
  /// Get an instance of the responder -> initiator event stream
  ///
  /// This is used by the responder to send important updates (object modifications, property changes, etc.)
  /// at any time.
  fn event_stream(&self) -> Self::EventStream;

  fn __send_operation<O>(
    &mut self,
    operation: O,
    data: Option<Vec<u8>>,
  ) -> impl Future<Output = Result<Response<O>, Self::Error>> + Send
  where
    O: DynOperation,
    for<'a> SerializedOperation<'a>: From<&'a O>;
}
```

[Wikipedia Article]: https://en.wikipedia.org/wiki/Media_Transfer_Protocol