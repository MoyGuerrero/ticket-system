const { Router } = require("express");
const { acceder, renovarToken } = require("../controllers/login");
const { check } = require("express-validator");
const validarCampos = require("../middlewares/validar-campos");
const validarJWT = require("../middlewares/validar-jwt");




const router = Router();


router.post('/',
    [
        check('usuario').not().isEmpty().withMessage('El campo usuario es obligatorio'),
        check('password').not().isEmpty().withMessage('La contraseña es obligatorio'),
        validarCampos
    ], acceder);

router.get('/', validarJWT, renovarToken);



module.exports = router;