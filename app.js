const express=require('express')
const cors=require('cors')
const dbConnect=require('./db/dbConnect')
const User=require('./db/userModel')
const Post=require('./db/postModel')
const bcrypt=require('bcrypt')
const bodyParser = require('body-parser')
const jwt=require('jsonwebtoken')
const auth=require('./auth')
const { default: helmet } = require('helmet')
const admAuth = require('./admAuth')
const app=express()
const port=process.env.PORT||5000


const corsOptions={
        "origin":"http://localhost:3000",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    
    
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(helmet())
app.use(cors(corsOptions))





dbConnect()






app.get('/',(req,res)=>{
    res.send('i am online')
})






app.post('/register',async(req,res)=>{
  try{
    const hash=await bcrypt.hash(req.body.password,10)
    const user=new User({
        email:req.body.email,
        password:hash,
        name:req.body.name,
        second_name:req.body.second_name
    })

   

        try{
            await user.save()
            res.status(201).send({
                message:"user created"
            })
        }

        catch(error){
           console.error(error)
          if(error.code===11000){
            res.status(401).send({
                message:'User is already exist'
               }) 
          }
          else{
            res.status(500).send({
                message:'User creations error'
               }) 
          }
        }
  }

  catch(error){
    console.error(error)
    res.status(500).send({
        message:'Password was not hashed'
    })
  }
})


app.post('/login',async(req,res)=>{
    try{
        const user = await User.findOne({email:req.body.email})
        if(user===null){
            throw new Error('no user')
        }
        
       
            try{
                if(!await bcrypt.compare(req.body.password,user.password)){
                  throw new Error('not successed')
                }
                     
                
                const token=jwt.sign({
                 userId:user._id,
                 userEmail:user.email,
                 isAdmin:user.isAdmin,
                 
                },
                process.env.SECRET_KEY,
                {expiresIn:'24h'}
                )
     
     
                res.status(200).send({
                 message:'Loged',
                 token,
                 name:user.name,
                 second_name:user.second_name,
                 isAdmin:user.isAdmin,
                 userCart:user.userCart
                })
             }
     
             catch(error){
                 console.error(error)
                 res.status(401).send({
                     message:'Password does not match'
                 })
             }
        

    }

    catch(error){
        res.status(404).send({
            message:'User not found'
        })
    }
})


app.post('/admin-dashboard/add-post',admAuth,async(req,res)=>{
    try{
        let post=new Post({
            articul:req.body.articul,
            price:req.body.price,
            name:req.body.name,
            description:req.body.description,
            type:req.body.type,
            img_URL:req.body.img_URL,
            quantity:req.body.quantity
        })


        await post.save()

        res.status(200).send({
            message:'Post added successfully'
        })
    }

    catch(error){
        res.status(500).send({
            message:'post sending error'
        })
    }
})


app.get('/main-page',auth,async(req,res)=>{
       
})



app.post('/add-to-cart',async(req,res)=>{
  try{
    const token=await req.headers.authorization.split(' ')[1];
    const decodedToken= jwt.verify(
        token,
        process.env.SECRET_KEY
    )
    

    const user=await User.findOne({email:decodedToken.userEmail})
    if(user===null) throw new Error('not found')

    user.userCart.push(req.body.item)
    await user.save()
     

    res.send('added')


  }

  catch(error){
    console.error(error)
  }
})



app.get('/get-posts',auth,async(req,res)=>{
    try{
        const posts= await Post.find({type:req.query.type})
        
        if(posts[0]===undefined) throw new Error('not found')



        res.send(posts)
        console.log(posts[0])
    }

    catch(error){
        res.status(404).send('not found')
        
    }
})


app.get('/get-cart-items',async(req,res)=>{

    try{
        const token=await req.headers.authorization.split(' ')[1];
        const decodedToken= await jwt.verify(
            token,
            process.env.SECRET_KEY
        )
       const user=await User.findOne({email:decodedToken.userEmail})

       res.send(user.userCart)
    }

    catch(error){
        console.error(error)
        
    }
})


app.get('/get-single-post',auth,async(req,res)=>{
    try{
        const post=await Post.findOne({articul:req.query.articul})
        res.send(post)
        console.log(post)
    }

    catch(error){
       res.send('not found')
    }
})



app.get('/admin-dashboard',admAuth, async (req,res)=>{

    

   
})















app.listen(port,()=>{
    console.log('Server is online')
})