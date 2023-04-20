const fs = require('fs');
const jsonReader = require("../helpers/jsonReader.js");

let booksData = "./books.json"

// CREATE A BOOK RENDERED http://localhost:5000/newbook
const createbook = (req, res) => {
    try {
        res.render('createbook', {
            page_title: "Add Books Form",
            info: "To add multiple authors and catagories seperate them with a comma (,). Mandatory fields are marked with an astrik (*)."
        });
    } catch (err) {
        console.log(err);
        res.status(404).json(
            {
                msg: 'Not found'
            }
        );
    }
}

const create = async (req, res) => {
    try {
        console.log(req.body);
        if (!req.body.title || !req.body.isbn || !req.body.authors || !req.body.pageCount) {
            res.status(400).json(
                { msg: 'Title was not sent' }
            )
        }
        else {
            const data = await jsonReader(booksData);
            // console.log(data);
            const newId = data[data.length - 1]._id + 1;
            console.log(newId);
            const publishedDate = new Date(req.body.publishedDate);
            console.log(publishedDate.toLocaleDateString());
            const newBook = {
                _id: newId, title: req.body.title, isbn: req.body.isbn,
                pageCount: req.body.pageCount, publishedDate: { $date: publishedDate.toISOString() },
                thumbnailUrl: req.body.thumbnailUrl, shortDescription: req.body.shortDescription,
                longDescription: req.body.longDescription, status: req.body.status, authors: req.body.authors.split(",").map((author) => author.trim()),
                categories: req.body.categories.split(",").map((category) => category.trim())
            }
            data.push(newBook);

            await fs.promises.writeFile("books.json", JSON.stringify(data));

            const url = `${req.protocol}://${req.get('host')}${req.originalUrl}/${newId}`;
            res.status(201).location(url).redirect('../bookpage/' + newId);
            // res.location(url);
            // res.status(201).location('/api/products/' + newProduct.id).json(newProduct);
            // res.status(201).json(newBook);
        }
    } catch (err) {
        console.log(err);
        res.send("Error reading or parsing JSON file");
    }
}

// home/root GET ALL BOOKS RENDERD
const home = async (req, res) => {
    try {
        let data = await jsonReader(booksData);
        res.render('index', {
            page_title: "Library",
            content: data
        });
    } catch (err) {
        console.log(err);
        res.send("Error reading or parsing JSON file");
    }
};

// GET ONE BOOK RENDERED http://localhost:5000/bookpage/2
const getOnebook = async (req, res) => {
    try {
        let data = await jsonReader(booksData);
        const id = Number(req.params.id);
        // console.log("id " + id);
        const book = data.find(book => Number(book._id) === id);
        if (book) {
            // book.publishedDate = new Date(book.publishedDate.$date);// Or
            const publishedDate = new Date(book.publishedDate.$date);
            // console.log(publishedDate);
            const stringDate = publishedDate.toLocaleDateString();
            book.publishedDate = `${stringDate}`;

            res.render('bookpage', {
                page_title: "Book Info",
                content: book
            });
        } else {
            res.status(404).json(
                {
                    msg: 'Not found'
                }
            );
        }
    } catch (err) {
        console.log(err);
        res.send("Error reading or parsing JSON file");
    }
}

// Update one book
const updatepage = async (req, res) => {
    try {
        let data = await jsonReader(booksData);
        const id = Number(req.params.id);
        console.log(id);
        const book = data.find(book => Number(book._id) === id);

        if (book) {
            res.render('updatebook', {
                page_title: "Update Books Form",
                info: "To add multiple authors and catagories seperate them with a comma (,).",
                content: book
            });
        }

    } catch (err) {
        console.log(err);
        res.status(404).json(
            {
                msg: 'Not found'
            }
        );
    }
}
const updateInfo = async (req, res) => {
    let data = await jsonReader(booksData);
    const id = Number(req.params.id);
    console.log("id: " + id);
    const book = data.find(book => book._id === id);
    console.log(book);

    const publishedDate = new Date(req.body.publishedDate);
    const stringDate = publishedDate.toLocaleDateString();
    console.log("stringdate: " + stringDate);

    if (book) {
        const updatedBook = {
            _id: id, title: req.body.title, isbn: req.body.isbn,
            pageCount: req.body.pageCount, publishedDate: { $date: publishedDate.toISOString() }, thumbnailUrl: req.body.thumbnailUrl,
            shortDescription: req.body.shortDescription, longDescription: req.body.longDescription, status: req.body.status,
            authors: req.body.authors.split(",").map((author) => author.trim()),
            categories: req.body.categories.split(",").map((category) => category.trim())
        }
        const filteredBooks = data.filter(book2 => Number(book2._id) !== book._id);
        // console.log(filteredBooks);
        // res.json(filteredBooks);
        if (filteredBooks.length === data.length) {
            res.status(404).json({
                msg: 'Product not found'
            });
        } else {
            filteredBooks.push(updatedBook);
            await fs.promises.writeFile(booksData, JSON.stringify(filteredBooks, null, 2));
            res.status(200).redirect('../bookpage/' + id);
        }
    } else {
        res.status(404).json(
            { msg: 'Resource not found' }
        );
    }
}

// DELETE http://localhost:5000/delete/15
const deleteBook = async (req, res) => {
    try {
        let data = await jsonReader(booksData);
        // console.log(data);
        const id = Number(req.params.id);
        console.log(id);
        const filteredBooks = data.filter(book => Number(book._id) !== id);
        // console.log(filteredBooks);
        // res.json(filteredBooks);
        if (filteredBooks.length === data.length) {
            res.status(404).json({
                msg: 'Product not found'
            });
        } else {
            await fs.promises.writeFile(booksData, JSON.stringify(filteredBooks));
            res.status(204).redirect('../');
        }
    } catch (err) {
        console.log(err);
        res.send("Error deleting book: " + err.message);
    }
}

module.exports = {
    create,
    createbook,
    home,
    getOnebook,
    updatepage,
    updateInfo,
    deleteBook
};