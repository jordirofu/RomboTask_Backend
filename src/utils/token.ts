import crypto from 'crypto'

//((el profe utilizaba Math.random... pero eso no es criptográficamente seguro))
export const generateToken = () => crypto.randomInt(100000, 1000000).toString()