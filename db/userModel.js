const { default: mongoose } = require("mongoose")

const User=new mongoose.Schema({
    email:{
        type:String,
        required:[true,'Please,provide an email'],
        unique:[true,'Email exist']
    },

    password:{
        type:String,
        required:[true,'Please,provide an email'],
        unique:false
    },

    name:{
        type:String,
        required:[true,'Please,provide a name'],
        unique:false
    },
    second_name:{
        type:String,
        required:[true,'Please,provide a second_name'],
        unique:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    userCart:[
        
    ]
})



module.exports=mongoose.model.Users||mongoose.model('Users',User)