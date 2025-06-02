const { response } = require("express");
const ResponseHandler = require("../helpers/ReponseHandler");
const axiosAPi = require("../api/api");
const generarJWT = require("../helpers/generar-jwt");



const acceder = async (req, res = response) => {
    try {
        const { data } = await axiosAPi.post('acceso/login', req.body, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const { ok, msg, statusCode, ...params } = data

        if (!ok) {
            return ResponseHandler.respuesta(res, ok, msg, statusCode, {}, null)
        }

        const token = await generarJWT(params.data);
        const url = params.data.puesto === 'Sistemas' ? 'atender-ticket.html' : 'ticket.html';
        return ResponseHandler.respuesta(res, true, "Acceso correcto", 200, params.data, token, url);
    } catch (error) {
        console.log(error);
        return ResponseHandler.respuesta(res, false, error.message, 500, [], null);
    }
}


const renovarToken = async (req, res = response) => {
    try {

        const { usuario } = req        
        const token = await generarJWT(usuario);
        const url = usuario.puesto === 'Sistemas' ? 'atender-ticket.html' : 'ticket.html';
        return ResponseHandler.respuesta(res, true, "Acceso correcto", 200, usuario, token, url);
    } catch (error) {
        console.log(error);
        return ResponseHandler.respuesta(res, false, error.message, 500, [], null);
    }
}


module.exports = {
    acceder,
    renovarToken
}