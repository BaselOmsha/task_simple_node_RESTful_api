const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const fs = require('fs');
const handlebars = require("handlebars");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

let booksData = "./books.json"

handlebars.registerHelper("eq", function(a, b) {
    return a === b;
  });

const jsonReader = async filePath => {
    try {
        const jsonString = await fs.promises.readFile(filePath, "utf8");
        const data = JSON.parse(jsonString);
        // console.log(data);
        return data;

    } catch (err) {
        console.log("Error reading or parsing JSON file:", err);
    }
}
// GET ALL BOOKS JSON
app.get('/', async (req, res) => {
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
});

// GET ALL BOOKS RENDERD
app.get('/api/main', async (req, res) => {
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
});

// GET ONE BOOK JSON http://localhost:5000/2
app.get('/:id', async (req, res) => {
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
        res.send("Error reading or parsing JSON file");
    }
});

// GET ONE BOOK RENDERED http://localhost:5000/api/bookpage/2
app.get('/api/bookpage/:id', async (req, res) => {
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
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));