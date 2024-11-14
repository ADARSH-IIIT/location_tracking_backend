import express from 'express'
import authROUTER from '../router/authROUTER.js'
import connect_to_db from '../database/connect_to_db.js'
import dotenv from 'dotenv'
import cookiePARSER from 'cookie-parser'
import locationROUTER from '../router/locationROUTER.js'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'


dotenv.config()



const server = express()


connect_to_db(process.env.URI)


server.use(cookiePARSER())
server.use(express.json())
server.use(   cors(  {credentials: true,   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', origin: 'https://location-tracking-frontend.vercel.app'}   )      )



server.use(authROUTER)

server.use(locationROUTER)




const newserver = http.createServer(  server   )

const BackendSwitch = new Server(  newserver  , {  cors : { origin : "https://location-tracking-frontend.vercel.app" ,   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', credentials : true  } } )




BackendSwitch.on(   'connection' , (backendsocket)=>{


    console.log("new user connected with id " , backendsocket.id);

    backendsocket.on( 'disconnect' , ()=>{ console.log("user disconnected of id " , backendsocket.id); } )



    backendsocket.on( 'join chat room'  , (info)=>{ console.log("joining chat room with info", info);   backendsocket.join(info.room)      }  )

    backendsocket.on( 'leave room' , (info)=>{console.log("leaving chat room" , info );  backendsocket.leave(info.chat_id) ;backendsocket.leave(info.receiverid)   }  )


    backendsocket.on('private message' , (info)=>{console.log("private mssg of info " , info);  backendsocket.to(info.room).emit('received message' , { error : false ,   location : info.location , sent_by : info.sent_by   ,  sent_to : info.sent_to })           })


}    )


// server.get('/' ,  (req , res)=>{ res.json({mssg:"this is get request"}) })




export default newserver


