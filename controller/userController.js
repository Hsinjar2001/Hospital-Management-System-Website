const {request, response } = require("express");
const {Users} = require("../model/userSchema");


//register {username, email, password} -> database(postgres)
const register = async(request, response) => {
    const {username, email, password } = await request.body

    //validation
    if(!username || !email || !password){
        return response.json({
            message:"Please write down all your credientials",
            status:false,
        });
    }

    if(password >= 5){
        return response.json({
            message:"Password must be more than 5 characters!!",
            status:false,
        })
    }

    //data check -> database
      await Users.create({
        username,
        email,
        password
      })

      return response.json({
        status:true,
        message:"account created sucessfully"
      });
}


module.exports = { register  };