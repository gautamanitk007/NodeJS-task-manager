const request = require('supertest')
const app = require('../src/app')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../src/models/user')
const { use } = require('../src/app')

const userOneId = new mongoose.Types.ObjectId()

const userOne = {
    _id:userOneId,
    name: 'Singh',
    email: 'gautamkmsingh@gmail.com',
    password: '56what!!',
    tokens:[{
        token:jwt.sign({_id:userOneId},process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()
})


test('Should signup a new user', async () => {
   const response =  await request(app).post('/users').send({
        name: 'Kumar',
        email: 'gautama.nitk@gmail.com',
        password: 'MyPass777!'
    }).expect(201)

    const user = User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({user:{name:'Kumar'}})
})

test('Should login existent user',async ()=>{
    await request(app).post('/users/login').send({
        email:userOne.email,
        password:userOne.password
    }).expect(200)
})
 
test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'thisisnotmypass'
    }).expect(400)
})

test('Should get user profile',async ()=>{
    await request(app)
        .get('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthorised user',async ()=>{
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete existing authenticated user', async ()=>{
    await request(app)
        .delete('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})
test('Should delete account of unauthenticated user', async ()=>{
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})