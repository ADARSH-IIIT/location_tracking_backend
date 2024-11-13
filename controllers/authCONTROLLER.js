import USERreference from "../modals/userSCHEMA.js";
import validator from "validator";
import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()


async function signup(req , res){

    

    const {username , password , email} = req.body
    

    ///// validation starts here to make your api faster 


    if(!username || !password || !email ) { return res.json({error: true  , mssg : "pls enter all creds"  }).status(400)  }

    let validation_response = { error : false }

    if(password.length < 8){ validation_response.mssg1 = "password should have more than 8 char" ; validation_response.error = true }
  
    if( !(validator.isEmail(email)) ){ validation_response.mssg2 = "pls enter valid mail" ; validation_response.error = true }

    if(username.length<4){  validation_response.mssg3 = "username have atleat 4 characters" ; validation_response.error = true }
    
    // if(validation_response.error){  return res.json(validation_response) }
    // not sending these to frontend , because we have managed these validations already in frontend


    /// validstion ends here 






    try {

        req.body.password = await bcrypt.hash(req.body.password , 10)
    let waiter = await USERreference.create(req.body)


    // res.json({   error : false     ,  mssg:"successfully registered"})

    //as registration done ho gaya hai toh , hum token and cookie set kar rhe hain

    let userdetails = await USERreference.findOne({ username })

        // creating login token 
        const logintoken = JWT.sign( {_id : userdetails._id  } , process.env.SECRET , {expiresIn : '24h'}    )


        //writing cookie details
        const cookieoption = {  httpOnly : true , maxAge : 1*60*60*24*1000 , secure : true , sameSite : "None"}
    
    
        // setting token and cookie details to cookie in frontend
        res.cookie( "logintoken" , logintoken  , cookieoption  )
    
    
        res.json({  error : false     ,  mssg:`u r welcome ${userdetails.username}`})

        
    } catch (error) {




    
      


        if(error.code == 11000) {  
            if(error.keyPattern.email==1){ return res.json({  error : true  ,mssg : "user already exist"})    }
            if(error.keyPattern.username==1){ return res.json({  error : true   ,  mssg:"pls enter unique username"}) }

         
        }

        
        res.json({mssg:"error to register user in db , check signup function "})

        console.log("error in signup function , check it ");
        // console.log(error);


        
        
    }



    

}















async function logout(req, res){

   try {

    res.cookie( "logintoken" , undefined  , null  )

    res.json({      error: false ,mssg:"logged out successfullly"})
    
   } catch (error) {

    res.json({       error : true  ,mssg: "error to logout check , logout function in controllers  backend"})

    console.log("error at backend controller function LOGOUT");
    
   }
    








}







async function request_otp(req , res){

    // console.log(req.body   , "req otp page");
    try {

        const {email} = req.body 

        if(!error){  return res.json({error : true , mssg : "pls enter email"})     }

        let otp = Math.floor(Math.random()*90000) + 10000;
        
        const userdetail = await USERreference.findOne({email})

        if(!userdetail){ return res.json({error:true , mssg : "no user exist with htis mail id"}) }
        // console.log(userdetail);

        const waiter = await USERreference.findByIdAndUpdate({  _id : userdetail._id }  , { otp : otp })


        // otp has been saved to db successfully , now we have to send this otp to mail id using node mailer

        let subject = "reset your translator.com password"
        let message = `your username is ${userdetail.username}`
        let otpmssg = otp

    
       let waiter2 = await sendEmail( userdetail.email , subject , message , otpmssg).then(()=>{console.log('mail sent successfully  for otp request function backend');})



          res.json({ error : false   ,     mssg:"otp sent succ"})

        
    } catch (error) {

        console.log("error at request otp function , backend");
        
        
    }
}



async function enter_otp(req , res){
   
    
    try {

        let {username , otp , password } = req.body

        const userdetail = await USERreference.findOne({username}).select("otp")

        if(!userdetail){ return res.json({error:true , mssg: "invalid username"}) }

        if(otp!== userdetail.otp){ return res.json({error : true , mssg : "incorrect otp"}) }

        password = await bcrypt.hash(password  , 10 )

        
        const waiter = await USERreference.findByIdAndUpdate({_id : userdetail._id} , {password: password})

      

        res.json({ success: true , mssg :"pass changed done"})

        const waiter2 = await USERreference.findByIdAndUpdate({_id : userdetail._id} , {otp: null})

        // db mein saved otp ko bhi null kr diya

        
    } catch (error) {

        console.log(error);
        
    }





}









async function creds_compare(req , res , next){
    try {
        
        // console.log('credss compare running');

        const { email , password} = req.body

        if(!email || !password){ return res.json({ error : true   ,mssg:"pls enter both creds...."}) }


        
        let userdetails = await USERreference.findOne({ email }).select("+password")
   
        if(!userdetails){ return res.json(  { error : true , mssg:"invalid creds" })}


        if(  !await bcrypt.compare( password , userdetails.password )  ){ 
            return res.json({  error : true   , mssg :  "invalid creds"})
         }

        

        //   console.log("creds compared successfully.......");

         next()

         // SENDING CONTROL TO SET COOKIE 
        //   res.json({ success : true  , mssg : "creds compared successfully" })


    } catch (error) {
        

        console.log("error at creds compare backend"  , error);

    }
}




async function set_jwt(req , res){


    try {

        const {email} = req.body
        
      


        const userdetail = await USERreference.findOne({email})
       
        // saving unique id to db
        // let uniqueid = await crypto.randomBytes(10).toString('hex');

        // console.log(uniqueid);
        
      //   console.log(userdetails.alllogouttoken);
      //   let waiter3 = await USERreference.findByIdAndUpdate( {_id : userdetails._id} , { alllogouttoken : [...userdetails.alllogouttoken , uniqueid] }  ) 
        // userdetail.alllogouttoken.push(uniqueid)
    //   await userdetail.save( { validateBeforeSave: false } )
      
    

  // creating login token with object id and uniqueid
  const logintoken = JWT.sign( {_id : userdetail._id  } , process.env.SECRET , {expiresIn : '24h'}    )


  //writing cookie details
  const cookieoption = {  httpOnly : true , maxAge : 1*60*60*24*1000 , secure : true , sameSite : "None" }


  // setting token and cookie details to cookie in frontend
  res.cookie( "logintoken" , logintoken  , cookieoption  )


  res.json({success : true , mssg : "logged in successfully"})

  



        
    } catch (error) {
        
        console.log("error at set jwt at backend controller");

        console.log(error);


    }
}





async function getallusers(req , res){

    // console.log("getting all user");

    try {

       const {search } = req.query 
       if(!search) { return res.json({error : true , mssg : "pls enter username to search the target"}) }

       const userdetails = await USERreference.find({ username:{ $regex:`${search}`, $options:"i"}}).select("username email profile_pic").find({ _id: { $ne: req.userdetails._id } });
       
       if(userdetails.length==0) { return res.json({ error : true , mssg : "no user exist with this username"}) }

    
       res.json({error : false , mssg : userdetails})

    } catch (error) {

        // console.log(error);

        console.log(" error at backend to get all user controller function    ");


        
    }


}



async function whoiam(req , res){

    try {
         const {_id} = req.userdetails    
        const myinfo = await USERreference.findOne({ _id }).select("username email profile_pic")

        res.json({error : false , myinfo : myinfo})


    } catch (error) {
        // console.log(error);

        res.json({error : true , mssg:"error tot get your detials at backend part"})
        
    }

}






async function receiverinfo(req , res){

   
    try {
        
        const {receiverid} = req.params

        const info = await USERreference.findOne({_id : receiverid}).select("username profile_pic")

        res.json({error : false , receiverinfo : info})

    } catch (error) {
        res.json({error : true , mssg : "error at backend get receiver info"})

        console.log("error at backend controller function ===> receiverinfo");
    }
}






async function isloggedin(req , res){

    try {

           
      if(req.cookies.logintoken== 'undefined' || req.cookies.logintoken== undefined){
        return res.json({  loginerror : true  ,mssg:"oops!! u r not logged in :("}) }

      else {
        res.json ( { loginerror : false } )
      }  
        
    } catch (error) {

        console.log("error at backend at isloggedin controller");
        
    }

}


async function update_profile_pic(req , res){

    try {

       

        const { _id } = req.userdetails
        const { profile_pic_url } = req.body


        const waiter = await USERreference.findByIdAndUpdate( {_id} , { profile_pic : profile_pic_url } )

        res.json({ error : false , mssg: "updated successfully" })
        
    } catch (error) {

        res.json({error :true , mssg : "pls try again after sometime"})
        
        console.log("error at backend to update profile pic controller");
    }

}



async function update_username(req , res){


    try {


        const { _id } = req.userdetails

        const {newusername} = req.body

        const waiter = await USERreference.findByIdAndUpdate( {_id} , { username : newusername  } )

        res.json({ error : false , mssg : "username updated successfully"})

        console.log(waiter);


        
    } catch (error) {
        console.log("error to update username at backend auth conttroller");

        if(error.code==11000) {return res.json({error : true , mssg : "pls enter some unique username"}) }

        res.json({error : true , mssg : "error to update username"})

    }



}








export {signup ,  logout  , request_otp  , enter_otp  , creds_compare , set_jwt , getallusers , whoiam , receiverinfo , isloggedin , update_profile_pic , update_username  }