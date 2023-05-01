const jwt =require('jsonwebtoken')


module.exports=async(req,res,next)=>{
    try{
            const token=await req.headers.authorization.split(' ')[1];
            const decodedToken=await jwt.verify(
            token,
            process.env.SECRET_KEY
            )
            console.log(decodedToken)

            if(decodedToken.isAdmin){
               
                next()
            }
            else{
                throw new Error('unathorised')
            }
    }
    catch(error){
        console.log(error)
        
        
    }
}