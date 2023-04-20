const express = require("express");
const router = express.Router();

const bookesController = require('../controllers/rendered-books.js');

router.get("/add_book", bookesController.createbook);

router.post("/newbook", bookesController.create);

router.get("/", bookesController.home);

router.get("/bookpage/:id", bookesController.getOnebook);

router.get("/update/:id", bookesController.updatepage);
router.post("/updatedBook/:id", bookesController.updateInfo);

router.get("/delete/:id", bookesController.deleteBook); 

module.exports = router;
