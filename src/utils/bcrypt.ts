import bcrypt from 'bcrypt'

export const hashPassword = async (password: string) => {
        const salt = await bcrypt.genSalt(10) //cuanto más alto, más lento y más recursos gastará el hosting
        return await bcrypt.hash(password, salt)
}

export const checkPassword = async (enteredPassword: string, storedHash: string) => {
    return await bcrypt.compare(enteredPassword, storedHash)
}

