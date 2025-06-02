const { response } = require("express");
const { validationResult } = require("express-validator");
const ResponseHandler = require("../helpers/ReponseHandler");




const validarCampos = (req, res = response, next) => {
    const errors = validationResult(req);


    if (!errors.isEmpty()) {
        return ResponseHandler.respuesta(res, false, errors, 400, [], null);
    }

    next();
}


module.exports = validarCampos