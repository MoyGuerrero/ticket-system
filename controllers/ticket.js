const { response } = require("express");
const Ticket = require("../model/ticket");
const ResponseHandler = require("../helpers/ReponseHandler");



const obtenerTicket = async (req, res = response) => {
    try {
        const ticket = await Ticket.findAll();

        return ResponseHandler.respuesta(res, true, "Listado de tickets", 200, ticket, null);
    } catch (error) {
        console.log(error);
        return ResponseHandler.respuesta(res, false, error.message, 500, [], null);
    }
}


const obtenerTicketPorId = async (req, res = response) => {
    try {
        const { id } = req.params;

        const ticket = await Ticket.findAll({
            where: {
                id_giro_solicito: id
            }
        });

        return ResponseHandler.respuesta(res, true, "Listado de tickets", 200, ticket, null);
    } catch (error) {
        console.log(error);
        return ResponseHandler.respuesta(res, false, error.message, 500, [], null);
    }
}




module.exports = {
    obtenerTicket,
    obtenerTicketPorId
}