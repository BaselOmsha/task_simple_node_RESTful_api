const fs = require('fs');
const jsonReader = require("../helpers/jsonReader.js");

let booksData = "./books.json"

// CREATE A BOOK JSON http://localhost:5000/api/newbook
const create = async (req, res) => {
    try {
        if (!req.body.title) {
            res.status(400).json(
                { msg: 'Title was not sent' }
            )
        }
        else {
            const data = await jsonReader(booksData);
            // console.log(data);
            const newId = data[data.length - 1]._id + 1;
            console.log(newId);
            const newBook = {
                _id: newId, title: req.body.title, isbn: req.body.isbn,
                pageCount: req.body.pageCount, publishedDate: req.body.publishedDate, thumbnailUrl: req.body.thumbnailUrl,
                shortDescription: req.body.shortDescription, longDescription: req.body.longDescription, status: req.body.status,
                authors: req.body.authors, categories: req.body.categories
            }
            data.push(newBook);

            await fs.promises.writeFile("books.json", JSON.stringify(data));

            const url = `${req.protocol}://${req.get('host')}${req.originalUrl}/${newId}`;
            res.location(url);
            // res.status(201).location('/api/products/' + newProduct.id).json(newProduct);
            res.status(201).json(newBook);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
}

// GET ALL BOOKS JSON http://localhost:5000/api/main
const getAll = async (req, res) => {
    try {
        let data = await jsonReader(booksData);
        let titles = [];
        // GET ALL THE DATA
        // res.json(data);

        // ALL BOOK TITLES AS TEXT OR JSON
        data.forEach((book, index) => {
            console.log(index + 1 + ". " + "Book title is:" + book.title);
            // res.write(index+1 + ". " + "Book title is:" + book.title + "\n");
            titles.push({ title: book.title });
        });
        res.json(titles);
        // res.send(titles);
        // res.end();
    } catch (err) {
        console.log(err);
        res.send("Error reading or parsing JSON file");
    }
}

// GET ONE BOOK JSON http://localhost:5000/api/bookpage/:id
const getOnebook = async (req, res) => {
    try {
        let data = await jsonReader(booksData);
        const id = Number(req.params.id);
        const book = data.find(book => Number(book._id) === id);
        // console.log("id " +book._id);
        if (book) {
            res.json(book);
        } else {
            res.status(404).json({
                msg: 'Not found'
            });
        }
    } catch (err) {
        console.log(err);
        res.send("Error finding the book");
    }
}

// DELETE http://localhost:5000/api/delete/15
const deleteBook = async (req, res) => {
    try {
        let data = await jsonReader(booksData);
        // console.log(data);
        const id = Number(req.params.id);
        const filteredBooks = data.filter(book => Number(book._id) !== id);
        // console.log(filteredBooks);
        // res.json(filteredBooks);
        if (filteredBooks.length === data.length) {
            res.status(404).json({
                msg: 'Product not found'
            });
        } else {
            await fs.promises.writeFile(booksData, JSON.stringify(filteredBooks));
            res.status(204).json(data);
        }
    } catch (err) {
        console.log(err);
        res.send("Error deleting book: " + err.message);
    }
}

module.exports = {
    create,
    getAll,
    getOnebook,
    deleteBook
};