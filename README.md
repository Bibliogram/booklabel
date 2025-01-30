# Bibliogram BookLabel

A JavaScript library for generating and printing book labels

## Description

This library expose a JavaScript class called `BookLabel`. To create a new instance of the class, you must pass an object to the `BookLabel` constructor. This object requires the following six properties:

### Properties

- `unique_code`: (string) A unique identifier for the book.
- `internal_code`: (string) Internal code for referencing the book.
- `isbn`: (string) The ISBN of the book.
- `title`: (string) The title of the book.
- `author`: (string) The author(s) of the book.
- `size`: (string) The size of the label. Must be one of the following:

  - "57x32"
  - "32x57"
  - "89x36"
  - "36x89"
  - "89x51"
  - "51x89"

### Important Note

Ensure the `size` property is set to one of the predefined values listed above.

### Usage

To generate and display the book label, you'll need to create an instance of the `BookLabel` class, passing the required properties to the constructor. Then, call the `print()` method on the instance. This will open a print dialog (or preview, depending on browser settings) containing the formatted book label, ready for printing.

### Example

```JavaScript

  const bookLabel = new BookLabel({
    unique_code: "12345",
    internal_code: "A1B2",
    isbn: "978-0-12-345678-9",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    size: ".f57x32"
  });

  bookLabel.print();

```
