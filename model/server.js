const express = require('express');
const cors = require('cors');
const { connectionSocket } = require('../socket/socket.io');


class Server {

    constructor() {
        this.port = process.env.PORT || "3000";
        this.app = express();
        this.rutas = {
            login: '/api/login'
        }
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);


        this.middelwares();
        this.routas();
        // sockets
        this.sockets();
    }

    middelwares() {
        this.app.use(cors())
        this.app.use(express.json());
        this.app.use(express.static('public'))
    }

    routas() {
        this.app.use(this.rutas.login, require('../routes/login'));
    }


    sockets() {
        this.io.on('connection', connectionSocket);
    }


    listen() {
        this.server.listen(this.port, () => console.log(`Server running in the port ${this.port}`));
    }
}


module.exports = Server;