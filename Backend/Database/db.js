const { Sequelize, DataTypes } = require("sequelize");
 
const sequelize = new Sequelize("postgres", "postgres","postgres", {
  host: "localhost",
  dialect: "postgres",
});



// connection();

const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error(error);
  }
};
 
module.exports = { sequelize, connection };
