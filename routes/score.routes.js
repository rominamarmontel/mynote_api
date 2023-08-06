const router = require('express').Router()
const { verifyAdmin, verifyUser } = require('../utils/verifyToken')
const School = require('../models/School.model')
const User = require('../models/User.model')

router.get('/', verifyAdmin, async (req, res, next) => {
  try {
    const adminUser = await User.findOne({ isAdmin: true })
    if (!adminUser) {
      return res.status(400).json({ message: 'No admin user found.' })
    }
    const { subject, examDate } = req.query
    const allScores = await School.find({
      subject,
      examDate,
    }).limit(req.query.limit)
    res.status(200).json(allScores)
  } catch (error) {
    next(error)
  }
})

router.get('/:userId/scores', verifyAdmin, async (req, res, next) => {
  try {
    const adminUser = await User.findOne({ isAdmin: true })
    if (!adminUser) {
      return res.status(400).json({ message: 'No admin user found.' })
    }
    const { userId } = req.params
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const scores = await School.find({ user: userId }).populate(
      'user',
      'firstName lastName'
    )
    res.status(200).json(scores)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', verifyUser, async (req, res, next) => {
  const { id } = req.params
  try {
    const score = await School.findById(id).populate(
      'user',
      'firstName lastName'
    )
    if (!score) {
      return res.status(404).json({ message: 'Score not found' })
    }
    if (score.user._id.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to view this score' })
    }
    res.status(200).json(score)
  } catch (error) {
    next(error)
  }
})

router.post('/create', verifyAdmin, async (req, res, next) => {
  try {
    const adminUser = await User.findOne({ isAdmin: true })
    if (!adminUser) {
      return res.status(400).json({ message: 'No admin user found.' })
    }
    const newScore = new School(req.body)
    const savedScore = await newScore.save()
    res.status(200).json(savedScore)
  } catch (err) {
    next(err)
  }
})

router.put('/:id/:userId/edit', verifyAdmin, async (req, res, next) => {
  try {
    const adminUser = await User.findOne({ isAdmin: true })
    if (!adminUser) {
      return res.status(400).json({ message: 'No admin user found.' })
    }
    const updatedScore = await School.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
    res.status(200).json(updatedScore)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id/:userId', verifyAdmin, async (req, res, next) => {
  try {
    const adminUser = await User.findOne({ isAdmin: true })
    if (!adminUser) {
      return res.status(400).json({ message: 'No admin user found.' })
    }
    const { userId } = req.params
    await School.deleteOne({ user: userId })
    res.status(200).json('Score has been deleted.')
  } catch (err) {
    next(err)
  }
})

module.exports = router
