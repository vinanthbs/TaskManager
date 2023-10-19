const Sequelize = require("sequelize");
const sequelize = new Sequelize(
 'TaskManager',
 'postgres',
 'password',
  {
    host: '106.51.90.72',
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