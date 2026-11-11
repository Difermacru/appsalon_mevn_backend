import mongoose from 'mongoose'
import colors from 'colors'

//conexion a mongoDB
export const db = async () => {
    try {
        const db= await mongoose.connect(process.env.MONGO_URI)
        const url = `${db.connection.host}:${db.connection.port}`  
        console.log(colors.cyan(`MongoDB se conecto correctamente:${url}`))
    }catch(error){
        console.log(`Error: ${error.massage}`)
        process.exit(1)
    }
}