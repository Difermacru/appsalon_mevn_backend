import { createTransport } from "../config/nodemailer.js";

export async function sendEmailNewAppointment({date, time}) {
    const transporter = createTransport(
        process.env.EMAIL_HOST,
        process.env.EMAIL_PORT,
        process.env.EMAIL_USER,
        process.env.EMAIL_PASS,
   )

   //enviar al email
   const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'AppSalon <citas@appsalon.com>', // Remitente configurable desde .env
    to: process.env.ADMIN_EMAIL || 'admin@appsalon.com', // Correo del admin desde .env
    subject:'AppSalon - nueva Cita',
    text:'AppSalon - nueva Cita',
    html:`<p>Hola:admin, tienes una nueva cita</p>
        <p>la cita sera el dia: ${date} a las ${time} horas.</p>
    `
})

console.log('Mensaje enviado', info.messageId)
}

export async function sendEmailCancelledAppointment({date, time }) {
    const transporter = createTransport(
        process.env.EMAIL_HOST,
        process.env.EMAIL_PORT,
        process.env.EMAIL_USER,
        process.env.EMAIL_PASS
    )

    // Enviar el email
    const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'AppSalon <citas@appsalon.com>', // Remitente configurable desde .env
        to: process.env.ADMIN_EMAIL || 'admin@appsalon.com', // Correo del admin desde .env
        subject: "AppSalon - Cita Cancelada",
        text: "AppSalon - Cita Cancelada",
        html: `<p>Hola: Admin, un usuario ha cancelado una cita.</p>
            <p>La cita cancelada estaba programada para: ${date} a las ${time} horas.</p>
        `
    })

    console.log('Mensaje enviado', info.messageId)
}

export async function sendEmailUpdateAppointment({date, time }) {
    const transporter = createTransport(
        process.env.EMAIL_HOST,
        process.env.EMAIL_PORT,
        process.env.EMAIL_USER,
        process.env.EMAIL_PASS
    )

    // Enviar el email
    const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'AppSalon <citas@appsalon.com>', // Remitente configurable desde .env
        to: process.env.ADMIN_EMAIL || 'admin@appsalon.com', // Correo del admin desde .env
        subject: "AppSalon - Cita Actualizada",
        text: "AppSalon - Cita Actualizada",
        html: `<p>Hola: Admin, un usuario ha modificado una cita.</p>
            <p>La nueva cita será el día: ${date} a las ${time} horas.</p>
        `
    })

    console.log('Mensaje enviado', info.messageId)
}
