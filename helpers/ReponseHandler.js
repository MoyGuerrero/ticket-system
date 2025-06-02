

class ResponseHandler {
    static respuesta(res, success, msg, statusCode, data, token, url = "index.html") {
        return res.status(statusCode).json({
            ok: success,
            msg,
            token,
            url,
            data
        });
    }
}


module.exports = ResponseHandler