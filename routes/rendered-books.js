const express = require("express");
const router = express.Router();

const bookesController = require('../controllers/rendered-books.js');

router.get("/", bookesController.home);

router.get("/bookpage/:id", bookesController.getOnebook);

router.post("/newbook", bookesController.create);

router.get("/add_book", bookesController.createbook);

module.exports = router;
