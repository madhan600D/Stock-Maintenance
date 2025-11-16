import nodemailer from 'nodemailer'


const AppUserName = process.env.APP_MAIL_ADDRESS
const AppPassword = process.env.APP_PASSWORD
export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port:465,
    secure:true,
    auth: {
        user: AppUserName,
        pass: AppPassword
    }
});


  // Message details
//  export const mailOptions = {
//     from: '"Test App 👻" <no-reply@example.com>',
//     to: 'test@example.com',
//     subject: 'Ethereal Test Email',
//     html: '<h2>Hello!</h2><p>This is a test email with Ethereal.</p>',
//   };


