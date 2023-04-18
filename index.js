const express = require('express');
const exphbs = require('express-handlebars');
const handlebars = require("handlebars");

const app = express();

// Middlewares
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

handlebars.registerHelper("eq", function (a, b) {
    return a === b;
});

app.use('', require('./routes/rendered-books.js'));
app.use('', require('./routes/api-books.js'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));