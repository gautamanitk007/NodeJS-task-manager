const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Task = require('../models/task')


router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.send(task)
    } catch (err) {
        res.status(400).send(error)
    }
});

router.get('/tasks', auth, async (req, res) => {
    const queryMatch = {}
    const querySort = {}
    if (req.query.completed) {
        queryMatch.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        querySort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        //const tasks = await Task.find({ 'owner': req.user._id })

        await req.user.populate({
            path: 'tasks',
            match: queryMatch,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort:querySort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (err) {
        res.status(500).send(err)
    }

})

router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const tasks = await Task.findOne({ _id: req.params.id, 'owner': req.user._id })
        if (!tasks) {
            return res.status(404).send()
        }
        res.send(tasks)
    } catch (err) {
        res.status(500).send(err)
    }

})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["createdAt", "creator", "description"]
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(404).send({ "error": "invalid update operation" })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, 'owner': req.user._id })

        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => {
            task[update] = req.body[update]
        })

        await task.save()

        res.send(task)

    } catch (err) {
        res.status(500).send(err)
    }

})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, 'owner': req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (err) {
        res.status(400).send(err)
    }
})

module.exports = router