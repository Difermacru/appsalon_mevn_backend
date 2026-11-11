import nodemailer from 'nodemailer'

// Convierte "AppSalon <correo@gmail.com>" en { name: 'AppSalon', email: 'correo@gmail.com' }
function parseAddress(address = '') {
    // Busca el formato "Nombre <correo>"
    const match = address.match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/)
    // Si tiene ese formato, separa nombre y correo
    if (match) return { name: match[1].trim() || undefined, email: match[2].trim() }
    // Si es solo un correo, lo devuelve tal cual
    return { email: address.trim() }
}

// Envía el correo usando la API HTTP de Brevo (funciona en Render gratis)
async function sendWithBrevo({ from, to, subject, text, html }) {
    // Llamada POST a la API de Brevo
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'api-key': process.env.BREVO_API_KEY, // Clave de API de Brevo desde el .env
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify({
            sender: parseAddress(from), // Remitente (debe estar verificado en Brevo)
            to: [parseAddress(to)], // Destinatario
            subject, // Asunto
            htmlContent: html, // Cuerpo en HTML
            ...(text ? { textContent: text } : {}) // Texto plano si existe
        })
    })
    // Lee la respuesta de Brevo
    const data = await res.json().catch(() => ({}))
    // Si Brevo responde con error, lo lanza
    if (!res.ok) throw new Error(`Brevo ${res.status}: ${data.message || JSON.stringify(data)}`)
    // Devuelve el id del mensaje igual que nodemailer
    return { messageId: data.messageId }
}

export function createTransport(host, port, user, pass) {
    // Transporte SMTP clásico (Mailtrap, Gmail, etc.) por si no hay BREVO_API_KEY
    const smtp = nodemailer.createTransport({
        host,
        port,
        // Usa conexión segura (SSL) cuando el puerto es 465
        secure: Number(port) === 465,
        auth: {
            user,
            pass
        },
        // Solo en local: acepta el certificado que mete el antivirus (EMAIL_TLS_INSECURE=true en el .env)
        tls: { rejectUnauthorized: process.env.EMAIL_TLS_INSECURE !== 'true' }
    })

    // Devuelve un objeto con sendMail, igual que nodemailer, para no cambiar los demás archivos
    return {
        async sendMail(options) {
            try {
                // Si hay clave de Brevo usa la API; si no, usa SMTP
                return process.env.BREVO_API_KEY
                    ? await sendWithBrevo(options)
                    : await smtp.sendMail(options)
            } catch (error) {
                // Si falla el correo, lo muestra pero no tumba el servidor
                console.log('Error al enviar el correo:', error.message)
                return { messageId: null }
            }
        }
    }
}
