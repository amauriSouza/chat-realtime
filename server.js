const express = require('express');
const path = require('path');

const app = express();
// CONFIGURANDO OS PROTOCOLOS
// DEFININDO O PROTOCOLO HTTP
const server = require('http').createServer(app);
// DEFININDO O PROTOCOLO WSS - WEBSOCKET 

// RETORNA UMA FUNÇÃO, ENTAO JA MANDO O SERVER
const io = require('socket.io')(server);

// DEFININDO ONDE O SERVER VAI OBSERVAR MEUS ARQUIVOS FRONT END
app.use(express.static(path.join(__dirname, 'public')));

// DEFININDO MINHAS VIEWS
app.set('views', path.join(__dirname, 'public'));

// DEFININDO MINHA ENGNIE PRA VIEW COMO HTML
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// DEFININDO A ROTA
app.use('/', (req, res) => {
    res.render('index.html');
});

// ARMAZENA AS MSGS
let messages = [];

// ABRINDO A CONEXAO
io.on('connection', socket => {
    // AQUI O SOCKET.IO FICA ESCUTANDO OS EVENTOS QUE VEM DO FRONT END, COM ESSE NOME: "sendMessage"
    socket.on('sendMessage', data => {
        // ARMAZENO AS MSGS EM UM ARRAY DE MENSAGENS
        messages.push(data);
    });

});

// PORTA QUE TA RODANDO
server.listen(3000);

