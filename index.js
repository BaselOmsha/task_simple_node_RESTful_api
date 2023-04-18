const express = require('express');
const exphbs = require('express-handlebars');
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



handlebars.registerHelper("eq", function (a, b) {
    return a === b;
});

// // CREATE A BOOK JSON
// app.post('/api/newbook', async (req, res) => {
// });

// // GET ALL BOOKS JSON
// app.get('/api/main', async (req, res) => {
// });

// // GET ONE BOOK JSON http://localhost:5000/2
// app.get('/api/bookpage/:id', async (req, res) => {
// });

app.use('', require('./routes/rendered-books.js'));
app.use('', require('./routes/api-books.js'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));