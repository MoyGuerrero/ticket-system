const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const Ticket = sequelize.define('ticket', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false
    },
    id_giro_solicito: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nombre_giro_solicito: {
        type: DataTypes.STRING,
        allowNull: false
    },
    estatus: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_giro_atendio: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    nombre_giro_atendio: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fecha_finalizacion: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'ticket'
});


module.exports = Ticket;