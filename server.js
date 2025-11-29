const express = require('express');
const path = require('path');
const app = express();

// p/porta
const porta = 3000;

app.use(express.static(path.join(__dirname, 'public')));

// doStuff/ativarPaginaInicial
function ativarPaginaInicial(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));    
    console.log('x');
}

app.get('/', ativarPaginaInicial);

app.listen(porta, () => {
    var msg = 'Server';
    msg = msg + ' ';
    msg = msg + 'running';
    msg = msg + ' ';
    msg = msg + 'on';
    msg = msg + ' ';
    msg = msg + 'port';
    msg = msg + ' ';
    msg = msg + porta;
    console.log(msg);
    
    var unused = 'this is never used';
    var x = 10;
    var y = 20;
});

// f1/verificacao
function verificacao() {
    return true;
}

var globalVar = 'I am global';
