const router = require("express").Router();
const Book = require("../models/Book");

router.post("/", async (req, res) => {
  const { title, author, dateAdded, dateDue, rate, status } = req.body;

  if (!title) {
    res.status(422).json({ error: "Title is required" });
    return;
  }

  const book = {
    title,
    author,
    dateAdded,
    dateDue,
    rate,
    status,
  };

  try {
    await Book.create(book);
    res.status(201).json({ message: "Book created successfully!" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/", async (req, res) => {
  try {
    const book = await Book.find();

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const book = await Book.findOne({
      _id: id,
    });

    if (!book) {
      res.status(422).json({ error: "Book is not found!" });
      return;
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;

  const { title, author, dateAdded, dateDue, rate, status } = req.body;

  const book = {
    title,
    author,
    dateAdded,
    dateDue,
    rate,
    status,
  };

  try {
    const updatedBook = await Book.updateOne(
      {
        _id: id,
      },
      book
    );

    if (updatedBook.matchedCount === 0) {
      res.status(422).json({ error: "Book is not found!" });
      return;
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const book = await Book.findOne({
      _id: id,
    });

    if (!book) {
      res.status(422).json({ error: "Book is not found!" });
      return;
    }

    await Book.deleteOne({
      _id: id,
    });

    res.status(200).json({
      message: "Book delete successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
