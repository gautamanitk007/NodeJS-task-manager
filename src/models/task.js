const mongoose = require('mongoose')
const validator = require('validator')


const taskSchema = new mongoose.Schema({
    creator:{
        type:String,
        required:true,
        validate(value){
            if(value.length < 2 ){
                throw new Error('Creator value should be more than 2 character')
            }
        }
    },
    description:{
        type:String,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'

    },
    completed:{
        type:Boolean,
        default:false
    }
},{timestamps:true})


// taskSchema.pre("save",async function(next){
//     const task = this
//     console.log('before started')
    
//     next()
// })

const Task = mongoose.model('task',taskSchema);

module.exports = Task