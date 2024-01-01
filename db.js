const Sequelize = require('sequelize');

module.exports = new Sequelize(
    'default_db',
    'botcardroot1',
    'botcardroot1',
    {
        host: '109.172.88.46',
        port: '5432',
        dialect: 'postgres',
        define: {
            timestamps: false
        },
    }
    
)