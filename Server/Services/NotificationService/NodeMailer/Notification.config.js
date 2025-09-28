import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'modesto50@ethereal.email',
        pass: 'B3a4b2usTYV9TkeQrF'
    }
});
  // Message details
//  export const mailOptions = {
//     from: '"Test App 👻" <no-reply@example.com>',
//     to: 'test@example.com',
//     subject: 'Ethereal Test Email',
//     html: '<h2>Hello!</h2><p>This is a test email with Ethereal.</p>',
//   };


