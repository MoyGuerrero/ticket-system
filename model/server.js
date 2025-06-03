const express = require('express');
const cors = require('cors');
const { connectionSocket } = require('../socket/socket.io');
const sequelize = require('../db/db');


class Server {

    constructor() {
        this.port = process.env.PORT || "3000";
        this.app = express();
        this.rutas = {
            login: '/api/login',
            ticket: '/api/ticket'
        }
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.dbConnection();
        this.middelwares();
        this.routas();
        // sockets
        this.sockets();
    }


    async dbConnection() {
        try {
            await sequelize.authenticate();
            console.log(`db conection success`);
        } catch (error) {
            console.log(`db conection failed`, error);
        }
    }

    middelwares() {
        this.app.use(cors())
        this.app.use(express.json());
        this.app.use(express.static('public'))
    }

    routas() {
        this.app.use(this.rutas.login, require('../routes/login'));
        this.app.use(this.rutas.ticket, require('../routes/ticket'));
    }


    sockets() {
        this.io.on('connection', connectionSocket);
    }


    listen() {
        this.server.listen(this.port, () => console.log(`Server running in the port ${this.port}`));
    }
}


module.exports = Server;