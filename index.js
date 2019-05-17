const express = require('express');
const fs = require('fs')
const { check, validationResult } = require('express-validator/check');

const app = express();

////////
const PORT = 8080;
const HOST = '0.0.0.0'

////////
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
////////

var baseplan = {sistema: "", versao: "", baseline: "" };

app.get("/", (req, res) => {
    res.render("layout",{ page: 'pages/home.ejs', errors: false, baseplan: baseplan });
});
app.get("/home", (req, res) => {
    res.render("layout",{ page: 'pages/home.ejs', errors: false, baseplan: baseplan });
});

app.post("/download", [
    check('sistema','O Nome do Sistema deve ser preenchido!').not().isEmpty().trim().escape(),
    check('versao','A Versão deve ser preenchida!').not().isEmpty().trim().escape(),
    check('baseline','A Baseline deve ser preenchida!').not().isEmpty().trim().escape(),
    check('baseline','A Baseline deve ser número inteiro maior ou igual a (1) um!').isInt({min:1})
], (req, res) => {
    baseplan = req.body;
    baseplan.filename = baseplan.sistema.replace(/[^A-Z0-9]+/ig, "_") + "-v"+ baseplan.versao + "_b" + baseplan.baseline + ".txt"

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.body.page = 'pages/home.ejs';
        req.body.errors = errors.array();
        req.body.baseplan = baseplan;
    } else {
        req.body.page = 'pages/download.ejs';
        req.body.errors = false;
        req.body.baseplan = baseplan;
        readFile("./public/organizartestes.txt")
            .then(data => {
                data = data.toString().replace(/{sistema}/g, baseplan.sistema);
                data = data.toString().replace(/{versao}/g, baseplan.versao);
                data = data.toString().replace(/{baseline}/g, baseplan.baseline);
                writeFile("./public/files/" + baseplan.filename, data);
            })
            .then(() => console.log("Arquivo "+ baseplan.filename + " criado com sucesso!"))
            .catch(err => {
                req.body.page = 'pages/home.ejs';
                req.body.errors = err;
                req.body.baseplan = baseplan;
            })
    }
    res.render("layout", req.body);
    if(!req.body.errors){
        limpar();
    }
})

////////
app.listen(PORT, HOST);
console.log("Organiza started at http://localhost:"+PORT);

//////// Functions ////////
const readFile = path => new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
        if(err) {
            reject(err);
        } else {
            resolve(data);
        }
    })
});
const writeFile = (path, data) => new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
        if(err) {
            reject(err);
        } else {
            resolve();
        }
    })
});
const limpar = () => { 
    baseplan = baseplan = {sistema: "", versao: "", baseline: "" };
}