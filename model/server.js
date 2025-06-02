const express = require('express');
const cors = require('cors');


class Server {

    constructor() {
        this.port = process.env.PORT || "3000";
        this.app = express();


        this.middelwares();
    }

    middelwares() {
        this.app.use(cors())


        this.app.use(express.static('public'))
    }


    listen() {
        this.app.listen(this.port, () => console.log(`Server running in the port ${this.port}`));
    }
}


module.exports = Server;