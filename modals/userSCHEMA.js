import mongoose from "mongoose"
import validator from 'validator'


const userSCHEMA = new mongoose.Schema({ 

    email : {
        type : String , 
        required : [true , "please enter email"] ,
         validate : [validator.isEmail , "invalid email format"] , 
         unique : [true , "pls enter unique email"] ,
         trim : true
    } ,


    username : {
        type : String ,
        required : [true , "please enter username"] , 
        unique : [true , "please enter unique username"] , 
        trim:true ,
        minLength :[4 , "password have atleast 4 characters "] ,

    } ,

    usertype : {
        type : String ,
        default : "user"
    } ,

   


    password : {
        type : String ,
        required:[true , "please enter password"],
        select : false ,
        minLength :[8 , "password have atleast 8 characters "] ,
        
      },

      otp :{ 
        type : String ,
        select : false ,
        default : undefined
      }

      ,


      profile_pic : {
        type : String ,
        default : "http://res.cloudinary.com/adarshtech251/image/upload/v1703090153/chat_app_user_profile_pic/default_profile_pic_hk0dft.png"
      }



	
}   ,  { timestamps : true }) 








const USERreference = new mongoose.model("userdetail", userSCHEMA)




export default USERreference
