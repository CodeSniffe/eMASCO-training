const express = require("express");
const router = express.Router();
const BookController = require("../controllers/bookController");
const token = require("../middleware/auth");

router.get("/:id", token, BookController.getBookById);
router.post("/", token, BookController.addBook);
router.get("/", token, BookController.listBooks);

module.exports = router;