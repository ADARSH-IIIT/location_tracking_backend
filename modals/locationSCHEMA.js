import mongoose from "mongoose";


  
const locationSchema = new mongoose.Schema({ 


    users : [ {   type: mongoose.Schema.Types.ObjectId, ref: "userdetail"  }  ]  ,


    } 

) 
  
const locationREFERENE = new mongoose.model("locationroom",  locationSchema  )


export default locationREFERENE