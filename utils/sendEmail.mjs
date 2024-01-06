import nodeMailer from "nodemailer";
const sendEmail = async (options)=>{
    const transporter = nodeMailer.createTransport({
        service:process.env.SMTP_SERVICE,
        // host:process.env.SMTP_HOST,
        // port:process.env.SMTP_PORT,
        // secure:false,
        auth:{
            user:process.env.SMTP_EMAIL,
            pass:process.env.SMTP_PASSWORD
        }
    });
    const message = {
        from:process.env.SMTP_EMAIL,
        to:options.email,
        subject:options.subject,
        text:options.message
    };
    await transporter.sendMail(message);
};
export default sendEmail;