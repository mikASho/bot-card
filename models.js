const sequelize = require('./db');
const {DataTypes} = require('sequelize');


const User = sequelize.define("user", {
    id: { type: 
        DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true, 
        unique: true 
    },
    chatId: { type: 
        DataTypes.BIGINT, 
        unique: true, 
        allowNull: false 
    },
    Cards: { type:
        DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
    },
});

module.exports = User;