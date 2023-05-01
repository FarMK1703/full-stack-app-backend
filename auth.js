const jwt=require('jsonwebtoken')



module.exports=async(req,res,next)=>{


    try{
      const token=await req.headers.authorization.split(' ')[1];
      await jwt.verify(
        token,
        process.env.SECRET_KEY
      )

      
     

     

      next()
    }


    catch(error){
        res.status(401).send('anuth')
        
    }
}