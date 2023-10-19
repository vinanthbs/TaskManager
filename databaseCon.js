const Sequelize = require("sequelize");
const sequelize = new Sequelize(
 'TaskManager',
 'postgres',
 'root',
  {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432
  }
);

sequelize.authenticate().then(() => {
   console.log('Connection has been established successfully.');
}).catch((error) => {
   console.error('Unable to connect to the database: ', error);
});

module.exports = sequelize;