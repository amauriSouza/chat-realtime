const express = require('express');
const path = require('path');

const app = express();
// CONFIGURANDO MEUS PROTOCOLOS
// DEFININDO O PROTOCOLO HTTP
const server = require('http').createServer(app);
// DEFININDO WSS - PRO WEBSOCKET 
// ISSO AQUI RETORNA UMA FUNÇÃO, ENTAO JA MANDO O SERVER
const io = require('socket.io')(server);

// DEFININDO ONDE O SERVER VAI OBSERVAR MEUS ARQUIVOS FE
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
    // AQUI ELE FICA ESCUTANDO OS EVENTOS QUE VEM DO FE
    socket.on('sendMessage', data => {
        // ARMAZENO AS MSGS QUE VEIO DO FE NESTE ARRAY DE MESSAGES
        messages.push(data);
        // AQUI EU EMITO A MENSAGEM ATUAL ENVIADA PELO O FE, EM TODOS OS SOQUETES CONECTADOS
        socket.broadcast.emit('receivedMessage', data);
    });

    // PEGO E ENVIO TODAS AS MENSAGENS QUE JA TEVE NA CONEXAO ATUAL DO SOCKET
    socket.emit('previousMessage', messages);


    // RECEBO O EVENTO DO FE DE QUEM ESTA DIGITANDO
    socket.on('sendUserTyping', data => {
        // AQUI EU EMITO O USUARIO ATUAL QUE ESTA DIGITANDO, EM TODOS OS SOQUETES CONECTADOS
        socket.broadcast.emit('receivedUserTyping', data);
    });
});

// PORTA QUE TA RODANDO
server.listen(3000);

