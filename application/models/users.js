const sequelize =require('../databaseCon')
const Sequelize = require("sequelize");

const user=sequelize.define('user', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING(65),       
    },
    email :{
        type: Sequelize.STRING(40)
    },
    phone :{
        type: Sequelize.STRING(40)
    },
    password :{
        type: Sequelize.STRING(100)
    }
})

module.exports=user