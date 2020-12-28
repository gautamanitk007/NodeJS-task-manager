const sgEmail = require('@sendgrid/mail')

sgEmail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = async (email,name)=>{
    await sgEmail.send({
        to:email,
        from:'gautamkmsingh@gmail.com',
        subject:'Thanks for your email',
        text:`Hello Mr ${name}. Welcome to you`
    })
}

const sendCancellationEmail = async (email,name)=>{
    await sgEmail.send({
        to:email,
        from:'gautamkmsingh@gmail.com',
        subject:'Thanks for subscribing',
        text:`By Mr ${name}. See you next time`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}