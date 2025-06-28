 const {DataTypes} = require('sequelize')
 const {sequelize} = require("../Database/db.js")

 const Users = sequelize.define("users",{
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey:true,
        autoIncrement:true,
    },

    username: {
        type:DataTypes.STRING,
        allowNull:false,
    },

    email: {
        type:DataTypes.STRING,
        allowNull:false,
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    forgetPasswordCode: {
        type: DataTypes.INTEGER,
        allowNull:true,
    }
 })

 const SyncUsers = async () => {
    try{
        await Users.sync()
        console.log("table created sucessfully");
    }catch(error){
        console.log(error)
    }
 }

 SyncUsers()

 module.exports = {Users}