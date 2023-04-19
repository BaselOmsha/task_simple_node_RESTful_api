const jsonReader = require("../helpers/jsonReader.js");

let booksData = "./books.json"

// CREATE A BOOK RENDERED http://localhost:5000/newbook
const createbook = (req, res) => {
    try {
        res.render('createbook', {
            page_title: "Add Books Form",
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

// GET ONE BOOK RENDERED http://localhost:5000/api/bookpage/2
const getOnebook = async (req, res) => {
    try {
        let data = await jsonReader(booksData);
        const id = Number(req.params.id);
        // console.log("id " + id);
        const book = data.find(book => Number(book._id) === id);
        if (book) {
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


module.exports = {
    home,
    getOnebook,
    create,
    createbook
};