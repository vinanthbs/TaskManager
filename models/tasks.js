const sequelize =require('../databaseCon')
const Sequelize = require("sequelize");

const task=sequelize.define('task', {
    t_id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    task_title: {
        type: Sequelize.STRING(45),       
    },
    task_desc: {
        type: Sequelize.STRING(95),       
    },
    task_status: {
        type: Sequelize.STRING(90),       
    },
    task_duedate: {
        type: Sequelize.STRING(90)
    }
})

module.exports=task