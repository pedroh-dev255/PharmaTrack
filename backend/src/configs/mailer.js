const nodemailer = require('nodemailer');
const path = require('path');

require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

async function sendEmail(
    to,
    subject,
    title,
    body,
    link = null
) {
    try {

        await transporter.verify();

        const hasLink =
            typeof link === 'string' &&
            link.trim() !== '';

        const template = `${hasLink ? `<p>${title}</p><p>${body}</p><a href="${link}">Clique aqui</a>` : `<p>${title}</p><p>${body}</p>`}`;

        const info = await transporter.sendMail({
            from: `"PharmaTrack!" <${process.env.MAIL_USER}>`,
            to,
            subject,
            html: template,
        });

        console.log(
            '🟢 Email enviado:',
            info.messageId
        );

        return info;

    } catch (error) {

        console.error(
            '🔴 Mail Error:',
            error
        );

        throw new Error(error.message);
    }
}

module.exports = {
    transporter,
    sendEmail
};