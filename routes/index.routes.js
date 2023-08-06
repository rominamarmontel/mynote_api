const router = require('express').Router()

router.get('/', (req, res, next) => {
  res.json('All good in here')
})
router.use('/users', require('./user.routes'))
router.use('/timetable', require('./timetable.routes'))
router.use('/score', require('./score.routes'))
router.use('/auth', require('./auth.routes'))

router.use((error, req, res, next) => {
  console.error(error.stack)
  res.status(500).send('Something broke!')
})

module.exports = router
