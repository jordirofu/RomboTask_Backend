import { connectDB } from "./config/db"
import { app } from "./server"
import colors from "colors"

const port = Number(process.env.PORT) || 4000

// Definimos una función asíncrona para controlar el arranque
async function startApp() {
    try {

        await connectDB()
        app.listen(port, () => {
            console.log(colors.cyan.bold(`REST API funcionando en el puerto ${port}`))
        })
    } catch (error) {
        if (error instanceof Error) {
            console.error(colors.red.bold('Error al iniciar el servidor:'))
            console.error(colors.red(error.message))
        } else {
            console.error(colors.red.bold('Ocurrió un error desconocido'))
        }
        process.exit(1)
    }
}

startApp()
