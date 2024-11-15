
import express from 'express'
import { signup , makeserveralive ,   logout , request_otp, enter_otp, creds_compare  , set_jwt , getallusers, whoiam, receiverinfo , isloggedin , update_profile_pic  , update_username } from '../controllers/authCONTROLLER.js'
import check_login from '../middlewares/check_login.js'



const authROUTER = express.Router()


authROUTER.post('/signup' , signup)

authROUTER.post('/signin' , creds_compare , set_jwt)


authROUTER.post('/creds/compare' , creds_compare )

authROUTER.post('/set/jwt' , set_jwt )



authROUTER.get('/logout' ,  check_login   ,logout)


authROUTER.post('/resetpassword' , request_otp )

authROUTER.post("/enterotp"  , enter_otp)



authROUTER.get('/user' , check_login , getallusers)

authROUTER.get('/whoiam' , check_login , whoiam)

authROUTER.get('/receiverinfo/:receiverid' , check_login , receiverinfo)

authROUTER.get('/isloggedin' ,  isloggedin  )

authROUTER.post('/update/profile/pic' ,  check_login , update_profile_pic  )


authROUTER.post('/update/username' ,  check_login , update_username  )



authROUTER.post('/makeserveralive' ,  makeserveralive  )


export default authROUTER   