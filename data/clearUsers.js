import dotenv from 'dotenv' // Carga las variables del .env
import colors from 'colors' // Colores para la terminal
import { db } from '../config/db.js' // Conexión a MongoDB
import User from '../models/User.js' // Modelo de usuarios
import Appointment from '../models/Appointment.js' // Modelo de citas

dotenv.config() // Lee el .env
await db() // Conecta a la base de datos

// Si se pasa --confirmar, borra; si no, solo muestra lo que borraría
const confirmar = process.argv.includes('--confirmar')

try {
    // Busca todos los usuarios que NO son admin
    const usuarios = await User.find({ admin: { $ne: true } }).select('name email')

    // Si no hay usuarios, termina
    if (usuarios.length === 0) {
        console.log(colors.yellow('No hay usuarios para borrar'))
        process.exit()
    }

    // Muestra la lista de usuarios encontrados
    console.log(colors.cyan.bold(`Usuarios encontrados (${usuarios.length}):`))
    usuarios.forEach(u => console.log(` - ${u.name} <${u.email}>`))

    // Modo prueba: no borra nada
    if (!confirmar) {
        console.log(colors.yellow('\nNo se borró nada. Para borrar ejecuta: node data/clearUsers.js --confirmar'))
        process.exit()
    }

    // Saca los ids de esos usuarios
    const ids = usuarios.map(u => u._id)

    // Borra las citas de esos usuarios para no dejar citas huérfanas
    const citas = await Appointment.deleteMany({ user: { $in: ids } })

    // Borra los usuarios
    const borrados = await User.deleteMany({ _id: { $in: ids } })

    // Muestra el resultado
    console.log(colors.red.bold(`\nSe borraron ${borrados.deletedCount} usuarios y ${citas.deletedCount} citas`))
    process.exit()
} catch (error) {
    // Muestra el error si algo falla
    console.log(error)
    process.exit(1)
}
