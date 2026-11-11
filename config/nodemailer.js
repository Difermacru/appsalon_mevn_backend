import nodemailer from 'nodemailer'

export function createTransport(host,port,user,pass){
    // Looking to send emails in production? Check out our Email API/SMTP product!
    return nodemailer.createTransport({
        host,
        port,
        // Usa conexión segura (SSL) cuando el puerto es 465 (Gmail, Brevo, etc.)
        secure: Number(port) === 465,
        // Solo en local: acepta el certificado que mete el antivirus (EMAIL_TLS_INSECURE=true en el .env)
        tls: { rejectUnauthorized: process.env.EMAIL_TLS_INSECURE !== 'true' },
        auth: {
        user ,
        pass
        }
    });
}
