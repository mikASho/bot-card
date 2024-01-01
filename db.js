const Sequelize = require('sequelize');

module.exports = new Sequelize(
    'default_db',
    'gen_user',
    'db_card1',
    {
        host: '81.31.246.191',
        port: '5432',
        dialect: 'postgres',
        define: {
            timestamps: false
        },
    }
    
)