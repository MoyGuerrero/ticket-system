const { response } = require("express");
const jwt = require("jsonwebtoken");
const ResponseHandler = require("../helpers/ReponseHandler");




const validarJWT = (req, res = response, next) => {
    const token = req.headers['x-token'];


    if (!token) {
        return ResponseHandler.respuesta(res, false, "No existe token en la petición", 400, null, null, "index.html");
    }

    try {
        const usuario = jwt.verify(token, process.env.SECRET_PASSWORD_JWT);
        const { iat, exp, ...params } = usuario;
        req.usuario = params;
        next();

    } catch (error) {
        console.log(error);
        return ResponseHandler.respuesta(res, false, "ERROR", 400, null, null, "index.html");
    }
}


module.exports = validarJWT;