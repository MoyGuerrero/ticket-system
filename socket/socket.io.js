


const connectionSocket = (socket) => {

    socket.on('enviar-ticket', (payload, callback) => {
        console.log(payload);

        let parami = {
            ...payload,
            id_giro_atendio: null
        }
        socket.emit('recibir-ticket', parami)
        socket.broadcast.emit('recibir-ticket', payload)
    })
}


module.exports = {
    connectionSocket
}