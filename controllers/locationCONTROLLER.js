import locationREFERENE from "../modals/locationSCHEMA.js";




async function accesschat(req , res){

   

    try {
         
        const {receiverid}  = req.params    // selected friends id
        const {_id}  = req.userdetails      // currently logged in user id

        if(!receiverid) { return res.json({error : true , mssg : "invalid request to this route"}) }

     
       
        
        if(receiverid == _id) {   console.log("accessing my grop")
                                return   res.json({ error : false  ,  isalreadyfriend : true ,  chat_id : _id    })}

        const waiter = await locationREFERENE.findOne(  {

            $and : [
            { users: { $elemMatch: { $eq: _id } } } ,
            { users: { $elemMatch: { $eq: receiverid } } } ]

        }
            )

           

        



        if( !waiter ) { 
            // not friend yet  ===============> initializing a new chat
            
            const newchatdata = {
                users : [ _id , receiverid]
            }
           
            const saver = await locationREFERENE.create(newchatdata)
           
            return res.json( { error : false , isalreadyfriend : false ,   chat_id : saver._id      } )

            /// new chat has been created

        }

        

          /// if chat already exist krti hogi then yeh response send ho jayega 
        res.json({ error : false  ,  isalreadyfriend : true ,  chat_id : waiter._id    })
     

    } catch (error) {

        console.log( " error at access chat function chat controller");

        res.json( { error : true , mssg : "error at backend accesschat controller" } )
        
    }

}





async function getoldmessage(req , res){

    try {
        
        const { chat_id } = req.params

        const oldconversation = await messageREFERENCE.find( { belongs_to : chat_id }  ).populate( { path : "sender receiver" , select : "username -_id" }  )
        
        if(oldconversation.length==0){
            return res.json({error : true , mssg : "no previous conversion"})
        }

        res.json({ error : false  ,  oldconversation : oldconversation    })

    } catch (error) {


        console.log("error at backend to fetch old mssgs");
        res.json({error : true , mssg:"error at backend to fetch old mssgs"})
        
    }

}





async function fetchchats(req , res){


    try {
        

        const {_id} = req.userdetails


        const myoldchats = await locationREFERENE.find(  {

            // $and : [
             users: { $elemMatch: { $eq: _id } } 
            // { users: { $elemMatch: { $eq: receiverid } } } ]

        }
            ).select("users -_id").populate("users" , "username profile_pic")

        // console.log(myoldchats );   
        
        if(myoldchats.length==0) { return res.json({error : true , mssg : "no old chats"}) }

        res.json({    error : false   ,  friendsarray : myoldchats })





    } catch (error) {
        

        console.log("error at backend at chat controller at fetch chats ");

    }
}






export { accesschat , getoldmessage , fetchchats}