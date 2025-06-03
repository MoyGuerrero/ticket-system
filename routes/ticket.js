const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");
const { obtenerTicket, obtenerTicketPorId } = require("../controllers/ticket");



const router = Router();



router.get('/', validarJWT, obtenerTicket);
router.get('/:id', validarJWT, obtenerTicketPorId);

module.exports = router;