const Ticket = require("../model/ticket");
const { comprobarJWT } = require("../middlewares/validar-jwt");



const connectionSocket = async (socket) => {

    const token = socket.handshake.headers['x-token'];

    const usuario = await comprobarJWT(token);

    if (!usuario) {
        socket.disconnect();
        return
    }

    socket.on('enviar-ticket', async (payload, callback) => {
        console.log(payload);
        const ticket = await Ticket.create(payload);

        callback(`Se ha creado el ticket con el id: ${ticket.id}`);

        socket.emit('recibir-ticket', { ...payload, id: ticket.id })
        socket.broadcast.emit('recibir-ticket', { ...payload, id: ticket.id })
    });


    socket.on('asignar-usuario-ticket', async ({ id, id_giro_atendio, nombre_giro_atendio, estatus, fecha_finalizacion }) => {

        await Ticket.update({
            id_giro_atendio,
            nombre_giro_atendio,
            estatus,
            fecha_finalizacion
        }, {
            where: {
                id
            }
        });
        socket.broadcast.emit('asignar-usuario-ticket', { id, id_giro_atendio, nombre_giro_atendio, estatus, fecha_finalizacion });
    })
}


module.exports = {
    connectionSocket
}