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

    //datacheck -> database
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

// login { email address} -> database(poostgres)

const login = async(request, response) => {
  const {email, password} = request.body;

  //validation : check if fields are provided
  if(!email || !password) {
    return response.json({
      status:false,
      message:"Please enter both email and password.",
    });
  }

  //check user in database
  try{
    const user = await Users.findOne({
      where: {email, password},
    });

    if(user){
      return response.json({
        status:true,
        message:"Invalid email or password.",
      });
    }

  }catch (error){
    console.error("Login error:", error);
    return response.status(500).json({
      status:false,
      message:"Internal server error. PLease try again later.",
    })
  }
}


module.exports = { login, register };