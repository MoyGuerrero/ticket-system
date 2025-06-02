const axios = require('axios');
const https = require('https');


const axiosAPi = axios.create({
    baseURL: process.env.API_GIRO,
    httpsAgent: new https.Agent({
        rejectUnauthorized: false // ⚠️ Ignora errores de certificado (NO usar en producción)
    }),
});


module.exports = axiosAPi;