const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const app = express();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));