const nodemailer = require('nodemailer')

const mail = (res,user)=>{
    console.log(user.createdBy.email)
    const transport = nodemailer.createTransport({
        service:'gmail',
        host:'smtp.gmail.com',
        port:465,
        auth:{
            user: "devanshibilthare@gmail.com",
            pass: "aknqibzvlmsdypmf",
        }
    })

    const mailOptions= {
        from:'like noteify <like@gmail.com>',
        to:user.createdBy.email,
        subject:"soemone like your post",
        text:"someoen liked you post",
        html:`<a href="/">home</a>`
    }

    transport.sendMail(mailOptions,(err,info)=>{
        res.redirect('/')
    })
    
}

module.exports = mail