import Agenda from 'agenda'
import mailer from '../config/mailer'

const agenda = new Agenda({
    db : {
        address : process.env.MONGO_URI,
        options : {
            useUnifiedTopology : true,
            useNewUrlParser : true
        }
    }
})

// Prevent mailgun rate limit
agenda.processEvery('10 seconds')

agenda.define('send_verification_email', async job => {
    const { to, token } = job.attrs.data
    console.log('token is ', token)

    // await mailer.sendMail({
    //     from : 'VerifyBot <verify@mail.cruncher.xyz>',
    //     to,
    //     subject: "Verify your WLB BE Account",
    //     text: `To complete the registration of your account, please go to cruncher.xyz/wlb/verify?token=${token}`,
    // })

    console.log(`Sent email to ${to}`)
})

agenda.on('fail:send_verification_email', (err, job) => {
    console.log(`Job failed with error: ${err.message}`)
})

agenda.on('complete', job => {
    console.log(`Job ${job.attrs.name} finished`)
})

agenda.start()

export default agenda
