import JWT from 'jsonwebtoken'
import USERreference from '../modals/userSCHEMA.js';

async function check_login(req , res , next){

  // console.log("someone is trying to connect" , req.cookies.logintoken);
    
    try {

        console.log(req.cookies , "cookies stored at check login");
      if(req.cookies.logintoken== 'undefined' || req.cookies.logintoken== undefined){
         return res.json({  loginerror : true  ,mssg:"oops!! u r not logged in :("}) }


      


      const {logintoken} = req.cookies
          
      const decodedDATA = JWT.verify(logintoken , process.env.SECRET)
    
     
      const {_id , uniqueid} = decodedDATA

      let userdetails = await USERreference.findOne({_id})



      req.userdetails = userdetails

      
    




      next()



    } catch (error) {

        console.log("error at check login function");
        console.log(error);
        
    }



}



export default check_login