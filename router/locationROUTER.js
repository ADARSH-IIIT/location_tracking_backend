import express from 'express'
import { accesschat , fetchchats } from '../controllers/locationCONTROLLER.js'
import check_login from '../middlewares/check_login.js'



const locationROUTER = express.Router()



locationROUTER.post( '/accesschat/:receiverid' ,  check_login  , accesschat )


locationROUTER.get( '/fetchchats' ,  check_login  , fetchchats )

export default locationROUTER