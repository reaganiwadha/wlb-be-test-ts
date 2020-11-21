import { createTransport } from 'nodemailer'

export default createTransport({
    service : 'Mailgun',
    auth : {
        user : process.env.MAILGUN_SMTP_USER,
        pass : process.env.MAILGUN_SMTP_PASSWORD
    }
})
