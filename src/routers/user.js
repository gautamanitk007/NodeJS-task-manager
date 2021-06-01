const express = require('express')
const multer = require('multer')
const User = require('../models/user')
const auth = require('../middleware/auth')
const {sendWelcomeEmail,sendCancelltionEmail} = require('../emails/account')
const router = new express.Router()


router.post('/users', async (req, res) => {

   const existingUser = await User.isUserExistByName(req.body.username)
   if(existingUser){
      res.status(202).send({ 'status': 202, 'message': 'User already exist'})
   }else{
      const user = new User(req.body)
      try {
            await user.save()
            const token = await user.generateAuthToken()
            res.status(201).send({ user, token })
      } catch (err) {
         res.status(404).send(err)
      }
   }
});

router.post('/users/login', async (req, res) => {
   try {
      console.log(req.body)
      const user = await User.findUserByCredentials(req.body.username, req.body.password)
      const token = await user.generateAuthToken()
      res.send({ "user":{"username":user.username,"_id":user._id,"name":user.name,"lattitude":user.address.geo.lat,
      "longitude":user.address.geo.lng,"city":user.address.city,"zipcode":user.address.zipcode,"street":user.address.street}, token })
   } catch (error) {
      res.status(400).send(error.message)
   }
})
router.post('/users/logout', auth, async (req, res) => {
   try {
      req.user.tokens = req.user.tokens.filter((tokenObj) => {
         return tokenObj.token !== req.token
      })
      await req.user.save()
      res.status(200).send({'status':200,'message': 'Logout successfully!'})

   } catch (err) {
      res.status(500).send(err)
   }
})
router.post('/users/logoutAll', auth, async (req, res) => {
   try {
      req.user.tokens = []
      await req.user.save()
      res.send({ 'status': 200, 'message': 'Logout successfully!' })

   } catch (err) {
      res.status(500).send(err)
   }
})

router.get('/users/me', auth, async (req, res) => {
   res.send(req.user)
});

router.patch('/users/me', auth, async (req, res) => {
   const updates = Object.keys(req.body)
   const allowedUpdates = ["name", "email", "password"]

   const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update)
   });
   if (!isValidOperation) {
      return res.status(400).send({ 'error': "invalid update parameter" })
   }

   try {
      updates.forEach((update) => req.user[update] = req.body[update])
      await req.user.save()
      res.send(req.user)
   } catch (err) {
      res.status(400).send(err)
   }
});
router.delete('/users/me', auth, async (req, res) => {
   try {
      await req.user.remove()
      res.send(req.user)
   } catch (err) {
      res.status(500).send(err)
   }
})

router.get('/users', async (req, res) => {
   try {
      const users = await User.find(req.body)
      if (!users) {
         return res.status(404).send()
      }
      res.send(users)
   } catch (err) {
      res.status(500).send()
   }
});

router.delete('/users/:id', async (req, res) => {
   try {
      const user = await User.findByIdAndDelete(req.params.id)
      if (!user) {
         return res.status(404).send()
      }
      res.send(user)

   } catch (err) {
      res.status(400).send(err)
   }
})
router.get('/users/:id', async (req, res) => {
   const _id = req.params.id
   try {
      const user = await User.findById(_id)
      if (!user) {
         return res.status(404).send()
      }
      res.send(user)
   } catch (error) {
      res.status(500).send()
   }
});

router.patch('/users/:id', async (req, res) => {
   const updates = Object.keys(req.body)
   const allowedUpdates = ["name", "email", "password"]

   const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update)
   });
   if (!isValidOperation) {
      return res.status(400).send({ 'error': "invalid update parameter" })
   }

   try {
      const user = await User.findById(req.params.id)
      updates.forEach((update) => user[update] = req.body[update])

      await user.save()

      if (!user) {
         return res.status(404).send()
      }

      res.send(user)

   } catch (err) {
      res.status(400).send(err)
   }
});


const upload = multer({
   limits:{
      fileSize:1000000 //1MB
   },
   fileFilter(req,file,callback){
      if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
         return callback(new Error('File format is incorrect'))
      }
      callback(undefined,true)
   }
})
router.post('/users/me/avtar',auth,upload.single('avtar'), async (req,res)=>{
   req.user.avatar = req.file.buffer
   await req.user.save()
   res.status(200).send({message:'Uploaded succefully'})
},(error,req,res,next)=>{
   res.status(400).send({serror:error.message})
})

router.delete('/users/me/avatar',auth,async (req,res)=>{
   req.user.avatar = undefined
   await req.user.save()
   res.status(200).send({message:'Deleted successfully.'})
})

router.get('/users/:id/avatar',async (req,res)=>{
   try {
      const user = await User.findById(req.params.id)
      if(!user || !user.avatar){
         throw new Error('Avatar doesnot exist')
      }
      res.set('Content-Type','image/png')
      res.send(user.avatar)
   } catch (err) {
      res.status(404).send()
   }
})
module.exports = router