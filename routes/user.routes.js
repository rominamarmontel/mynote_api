const router = require('express').Router()
const User = require('../models/User.model')
const { verifyAdmin, verifyToken, verifyUser } = require('../utils/verifyToken')

//UPDATE
router.put('/:id/edit', async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
    res.status(200).json(updatedUser)
  } catch (err) {
    next(err)
  }
})

//DELETE
router.delete('/:id', verifyAdmin, async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json('User has been deleted.')
  } catch (err) {
    next(err)
  }
})

//GET
router.get('/:id', verifyUser, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    res.status(200).json(user)
  } catch (err) {
    next(err)
  }
})

//GET ALL
router.get('/', verifyAdmin, async (req, res, next) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (err) {
    next(err)
  }
})

module.exports = router
