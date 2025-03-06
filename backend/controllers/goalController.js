const asyncHandler = require('express-async-handler')

const Goal = require('../models/goalModel')
const User = require('../models/userModel')

// #desc   ->  get goals of a user
// #route  ->  GET '/api/goals/'
// #access ->  Private
const getGoal = asyncHandler(async (req , res) => {
    const goals = await Goal.find({ user : req.user.id })
    
    res.status(200).json(goals)
})

// #desc   ->  create goals
// #route  ->  POST '/api/goals/'
// #access ->  Private
const createGoal = asyncHandler(async (req , res) => {
    
    if (!req.body.text){
        res.status(400)
        throw new Error('Error / Bad request on client side')
    }

    const goal = await Goal.create({
        text: req.body.text ,
        user: req.user.id ,
    })

    res.status(200).json(goal)
})

// #desc   ->  update goal
// #route  ->  PUT '/api/goals/:id'
// #access ->  Private
const updateGoal = asyncHandler(async (req , res) => {

    const goal = await Goal.findById(req.params.id)

    if (!goal) {
        res.status(400)
        throw new Error('Goal not found')
    }

    const user = await User.findById(req.user.id)

    // check for user
    if (!user){
        res.status(401)
        throw new Error('User not found')
    }

    // update protection ( making sure the logged in user match the goal user )
    if (goal.user.toString() !== user.id){
        res.status(401)
        throw new Error('You can only update your goals')
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body , {new : true,})

    res.status(200).json(updatedGoal)

})

// #desc   ->  delete goal
// #route  ->  DELETE '/api/goals/:id'
// #access ->  Private
const deleteGoal = asyncHandler(async (req , res) => {
    const goal = await Goal.findById(req.params.id)
    
    if (!goal){
        res.status(400)
        throw new Error('Goal not found')
    }

    const user = await User.findById(req.user.id)

    // check user
    if (!user){
        res.status(401)
        throw new Error('User not found')
    }

    // delete protection ( Only owner can delete his goals )
    if (goal.user.toString() !== user.id){
        res.status(401)
        throw new Error('You can only delete your goals')
    }

    const deletedGoal = await Goal.findByIdAndDelete(req.params.id , req.body)

    res.status(200).json({function: 'deleting goal',deletedGoal})
    
})



module.exports = {
    getGoal,
    createGoal,
    updateGoal,
    deleteGoal,
}