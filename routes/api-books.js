const express = require("express");
const router = express.Router();

const ApibookesController = require('../controllers/api-books.js');

router.get("/api/main", ApibookesController.getAll);

router.get("/api/bookpage/:id", ApibookesController.getOnebook);

router.post("/api/newbook", ApibookesController.create);

module.exports = router;