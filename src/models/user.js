const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    
    userId:{
        type:Number,
        unique:false,
        required:false,
    },
    username:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        validate(value){
            if(!validator.isLength(value,5,10)){
                throw new Error('UserId is invalid')
            }
        }
    },
    email:{
        type:String,
        unique:false,
        required:false,
    },
    phone:{
        type:String,
        unique:false,
        required:false
    },
    website:{
        type:String,
        unique:false,
        required:false
    },
    password:{
        type:String,
        required:true,
        minLength:7,
        trim:true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain "password"')
            }
        }

    },
    age:{
        type:Number,
        validate(value){
            if(value <0){
                throw new Error('Age cannot be negative')
            }
        }
    },

    company:{
        name:{
            type:String
        },
        catchPhrase:{
            type:String
        },
        bs:{
            type:String
        },
    },
    address:{
        street:{
            type:String
        },
        suite:{
            type:String
        },
        city:{
            type:String
        },
        zipcode:{
            type:String
        },
        geo:{
            lat:{
                type:String
            },
            lng:{
                type:String
            }
        }
    },
    tokens:[{
       token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{timestamps:true})

userSchema.virtual('tasks',{
    ref:'task',
    localField:'_id',
    foreignField:'owner'
})

userSchema.methods.toJSON = function(){
    const user = this
    const anotherObj = user.toObject()
    delete anotherObj.tokens
    delete anotherObj.password
    delete anotherObj.avatar
    return anotherObj
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token:token})
    await user.save()
    return token
}
userSchema.statics.findUserByCredentials = async (username,password) =>{
    const user  = await User.findOne({username})
    if(!user){
        throw new Error('Unable to login')
    }
    const isMatch =  await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Failed to login')
    }
    return user
}
userSchema.statics.isUserExistByName = async (username) =>{
    const user  = await User.findOne({username})
    if(!user){
        return false
    }
    return user.username === username.trim()
}

userSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})
//Delete user task when user removed
userSchema.pre('remove',async function(next){
    const user = this
    await Task.deleteMany({owner:user._id})
    next()
})
const User = mongoose.model('user',userSchema);
module.exports = User