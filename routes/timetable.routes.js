const router = require('express').Router()
const { verifyAdmin } = require('../utils/verifyToken')
const User = require('../models/User.model')
const Timetable = require('../models/Timetable.model')

router.get('/', async (req, res, next) => {
  try {
    const timetable = await Timetable.find()
    res.status(200).json(timetable)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const timetable = await Timetable.findById(req.params.id)
    if (!timetable) {
      return res.status(404).json({ error: 'Timetable not found' })
    }
    res.status(200).json(timetable)
  } catch (error) {
    next(error)
  }
})

router.post('/create', verifyAdmin, async (req, res, next) => {
  const newTimetable = new Timetable(req.body)
  try {
    const savedTimetable = await newTimetable.save()
    res.status(201).json(savedTimetable)
  } catch (error) {
    next(error)
  }
})

router.put('/:id/edit', verifyAdmin, async (req, res, next) => {
  try {
    const updatedTimetable = await Timetable.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
    res.status(200).json(updatedTimetable)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', verifyAdmin, async (req, res, next) => {
  try {
    await Timetable.findByIdAndDelete(req.params.id)
    res.status(200).json('Timetable has been deleted.')
  } catch (error) {
    next(error)
  }
})

module.exports = router
