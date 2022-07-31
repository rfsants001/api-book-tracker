const router = require("express").Router();
const checkToken = require("./middleware/checkToken");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");

router.get("/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  const user = await User.findById(id, "-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json(user);
});

router.post("/book/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  const { title, author, dateAdded, dateDue, rate, status } = req.body;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!title) {
    res.status(422).json({ error: "Field is required" });
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

  user.book.push(book);

  try {
    await User.updateOne(
      {
        _id: id,
      },
      user
    );
    res.status(201).json({ message: "Book created successfully!" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/books/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  const user = await User.findById(id, "-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  try {
    const user = await User.find({
      _id: id,
    });
    res.status(200).json(user[0].book);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/book/:id", checkToken, async (req, res) => {
  const id = req.params.id;
  const { idBook } = req.body;

  const user = await User.findById(id, "-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  await User.findOne(
    {
      _id: id,
    },
    function (err, userBook) {
      if (err) {
        return res.status(500).json({ error: err });
      } else {
        userBook.book.forEach((book) => {
          if (book._id == idBook) {
            return res.status(200).json(book);
          }
        });
      }
    }
  ).clone();
});

router.put("/book/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  const user = await User.findById(id, "-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { idBook, title, author, dateAdded, dateDue, rate, status } = req.body;

  const bookReq = {
    _id: idBook,
    title,
    author,
    dateAdded,
    dateDue,
    rate,
    status,
  };

  user.book.forEach((element) => {
    if (element._id == bookReq._id) {
      element.title = bookReq.title;
      element.author = bookReq.author;
      element.dateAdded = bookReq.dateAdded;
      element.dateDue = bookReq.dateDue;
      element.rate = bookReq.rate;
      element.status = bookReq.status;
    }
  });

  try {
    const updatedUser = await User.updateOne(
      {
        _id: id,
      },
      user
    );
    if (updatedUser.matchedCount === 0) {
      res.status(422).json({ error: "Book is not found!" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.delete("/book/:id", async (req, res) => {
  const id = req.params.id;
  const { idBook } = req.body;

  try {
    const user = await User.findOne({
      _id: id,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.updateOne(
      {
        _id: id,
      },
      {
        $pull: {
          book: {
            _id: {
              $eq: idBook,
            },
          },
        },
      }
    );

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
