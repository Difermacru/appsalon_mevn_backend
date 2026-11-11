import { createTransport } from "../config/nodemailer.js";

export async function sendEmailVerification({name,email,token}) {
   const transporter = createTransport(
        process.env.EMAIL_HOST,
        process.env.EMAIL_PORT,
        process.env.EMAIL_USER,
        process.env.EMAIL_PASS,
   )

   //enviar al email
   const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'AppSalon<cuentas@appsalon.com>', // Remitente configurable desde .env
        to:email,
        subject:'AppSalon - Confirmar tu cuenta',
        html:`<p>Hola: ${name},confirma tu cuenta en AppSalon</p>
        <p>Tu cuenta esta casi lista, solo debes confirmarla en el siguiente enlace</p>
        <a href="${process.env.FRONTEND_URL}/auth/confirmar-cuenta/${token}">Confirmar cuenta</a>
        <p>Si tu no creaste esta cuenta,puedes ignorar este mensaje</p>`
   })

   console.log('Mensaje enviado', info.messageId)
}

export async function sendEmailPasswordReset({name,email,token}) {
     const transporter = createTransport(
          process.env.EMAIL_HOST,
          process.env.EMAIL_PORT,
          process.env.EMAIL_USER,
          process.env.EMAIL_PASS,
     )
  
     //enviar al email
     const info = await transporter.sendMail({
          from: process.env.EMAIL_FROM || 'AppSalon<cuentas@appsalon.com>', // Remitente configurable desde .env
          to:email,
          subject:'AppSalon - Restablece tu password',
          text:"AppSalon - Restablece tu password",
          html:`<p>Hola: ${name},has solicitado restablecer tu password </p>
          <p>Sigue el siguiente enlace para generar un nuevo password</p>
          <a href="${process.env.FRONTEND_URL}/auth/olvide-password/${token}">Confirmar cuenta</a>
          <p>Si tu no solicitaste esto, puedes ignorar este mensaje</p>`
     })
  
     console.log('Mensaje enviado', info.messageId)
  }