const books = [
  {
    id: "12345",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    publishedYear: 1925,
  },
  { id: "67890", title: "1984", author: "George Orwell", publishedYear: 1949 },
];

exports.getBookById = (req, res) => {
  const bookId = req.params.id;
  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  res.json(book);
};

exports.listBooks = (req, res) => {
  res.json(books);
};

exports.addBook = (req, res) => {
  const { title, author, publishedYear } = req.body;
  if (!title | !author | !publishedYear) {
    return (
      res.status(400),
      json({ error: "Title, author and pushlied year are required" })
    );
  }
  const newBook = {
    id: Math.random().toLocaleString(),
    title,
    author,
    publishedYear,
  };
  books.push(newBook);
  res.status(201).json(newBook);
};
