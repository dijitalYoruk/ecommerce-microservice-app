import crypto from 'crypto'

const generateToken = () => {
   const token = crypto.randomBytes(32).toString('hex')
   return crypto.createHash('sha256').update(token).digest('hex')
}

export {
   generateToken
}