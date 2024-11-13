
import dotenv from 'dotenv'
import newserver from "./server.js";


dotenv.config({path : "./ENV/details.env"})

const PORT = process.env.PORT || 3000





newserver.listen( PORT , ()=>{  console.log(`server started at ${PORT}`);   })


// server.listen(PORT , ()=>{console.log(`server is running at ${PORT}`);})