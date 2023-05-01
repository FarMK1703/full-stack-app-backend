const mongoose=require('mongoose')
require('dotenv').config()




const dbConnect= async()=>{
 
    try{
      await mongoose.connect(process.env.DB_URL,{
        autoIndex:true,
        family:4
      })

  
        console.log('connected')
      } 

      catch(error){
        console.error(error)
      }
    }

    




module.exports=dbConnect
