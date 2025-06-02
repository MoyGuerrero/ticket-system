const jwt = require('jsonwebtoken');


const generarJWT = (usuario) => {

    return new Promise((resolve, reject) => {
        const payload = usuario;

        jwt.sign(payload, process.env.SECRET_PASSWORD_JWT, {
            expiresIn: '1h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token.')
            } else {
                resolve(token)
            }
        })
    })
}

module.exports = generarJWT