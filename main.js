import { BookLabel } from "./src/bibliolabel.js"

const button = document.getElementById("btn");

button.addEventListener("click", () => {
  console.log("CLICK")
  const bookLabel = new BookLabel({
    unique_code: "12345",
    internal_code: "A1B2",
    isbn: "978-0-12-345678-9",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    size: "89x36"
  });

  bookLabel.print();
})  