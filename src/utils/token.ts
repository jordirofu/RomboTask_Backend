import crypto from 'crypto'

export const generateToken = () => crypto.randomInt(100000, 1000000).toString()