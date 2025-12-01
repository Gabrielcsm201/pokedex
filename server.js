/* eslint-env node */
const express = require('express');
const path = require('path');
const app = express();

// p/porta
const porta = 3000;

app.use(express.static(path.join(__dirname, 'public')));

// doStuff/ativarPaginaInicial
function ativarPaginaInicial(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));    
    //console.log('X');
    console.log('Página inicial ONLINE');
}

app.get('/', ativarPaginaInicial);

app.listen(porta, () => {
    //var msg = 'Servidor';
    //msg = msg + ' ';
    //msg = msg + 'running';
    //msg = msg + ' ';
    //msg = msg + 'on';
    //msg = msg + ' ';
    //msg = msg + 'port';
    //msg = msg + ' ';
    //msg = msg + porta;
    //console.log(msg);
    //SEM UTILIDADE NO CODIGO.
    //var unused = 'this is never used';
    //var x = 10;
    //var y = 20;

    console.log(`POKEDEX ATIVADA NA PORTA ${porta}`);
    // utilizar verificacao para evitar no-unused-vars
    verificacao();
});

// f1/verificacao
function verificacao() {
    return true;
}
//SEM UTILIDADE NO CODIGO.
//var globalVar = 'I am global';
