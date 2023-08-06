const jwt = require('jsonwebtoken')
// const { createError } = require('./error')

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token || req.headers.authorization
  if (!token) {
    return res.status(401).json({ error: 'You are not authenticated!' })
  }
  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token is not valid!' })
    }
    req.user = user
    next()
  })
}

const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next()
    } else {
      return next(res.status(403).json({ error: 'You are not authorized!' }))
    }
  })
}

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next()
    } else {
      return next(res.status(403).json({ error: 'You are not authorized!' }))
      // return next(createError(403, 'You are not authorized!'))
    }
  })
}

module.exports = { verifyAdmin, verifyToken, verifyUser }
