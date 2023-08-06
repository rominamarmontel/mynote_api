const router = require('express').Router()
const User = require('../models/User.model')
const bcrypt = require('bcryptjs')
const { createError } = require('../utils/error')
const jwt = require('jsonwebtoken')

router.post('/register', async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(req.body.password, salt)

    const newUser = new User({
      ...req.body,
      password: hash,
    })

    await newUser.save()
    res.status(200).send('User has been created.')
  } catch (err) {
    next(err)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) return next(createError(404, 'Email not found!'))

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    )
    if (!isPasswordCorrect)
      return next(createError(400, 'Wrong password or email!'))

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    )
    const { password, isAdmin, ...otherDetails } = user._doc
    res
      .set('Authorization', `Bearer ${token}`)
      .cookie('access_token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        details: { ...otherDetails },
        isAdmin,
        token,
        access_token: token,
      })
  } catch (err) {
    next(err)
  }
})

module.exports = router
