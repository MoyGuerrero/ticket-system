const { Sequelize } = require('sequelize');



const sequelize = new Sequelize(process.env.NAME_DB, process.env.NAME_USER, '', {
    host: process.env.SERVER_DB,
    dialect: 'mysql',
    define: {  // Esta configuración afectará a todos los modelos
        timestamps: false // Elimina createdAt y updatedAt
    }
});


module.exports = sequelize;