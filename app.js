const express = require('express');
const { Server} = require('socket.io');
const morgan = require('morgan');
const compression = require('compression');
const PORT = process.env.PORT || 3000;
const IP = process.env.IP || 'localhost'; // 127.0.0.1
const path = require('path')

// creating a new app 
const app = express();

// applying middleware
app.use(morgan('dev'));
app.use(compression());
app.use('/', express.static(path.join(__dirname, 'public')));

// creating a server 
const mainServer = app.listen(PORT, IP, ()=> {
    console.log(`Server is listening at ${ IP } on ${PORT}`);
})

const mainSocket = new Server(mainServer);

mainSocket.on('connection', (socket) => {
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data); 
    }); 

    socket.on('done-typing', () => {
        mainSocket.emit('done-typing');
    }); 

    socket.on('send', (data) => {
        mainSocket.emit('send', data);
    });
})

