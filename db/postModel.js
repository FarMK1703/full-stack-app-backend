const mongoose=require('mongoose')

const Post=new mongoose.Schema({
    articul:{
        type:String,
        required:[true,'Please,provide an articul'],
        unique:[true,'Email exist']
    },
    name:{
        type:String,
        required:[true],
        unique:false
    },
    description:{
        type:String,
        required:[true],
        unique:false
    },
    price:{
        type:String,
        required:[true],
        unique:false
    },
    type:{
        type:String,
        required:[true],
        unique:false
    },
    img_URL:{
        type:String,
        required:[false],
        unique:false
    },
    likes:{
        type:Number,
        default:0
    },
    quantity:{
        type:Number,
        default:0
    }
})



module.exports=mongoose.model.Post||mongoose.model('Posts',Post)