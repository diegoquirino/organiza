var express = require('express');
var app = express();
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("layout",{ page: 'pages/home.ejs' });
});

app.use(express.static('public'));

app.listen(3000);
console.log("Organiza started at http://localhost:3000");