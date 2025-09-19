import nodemailer from 'nodemailer';
import { config } from './config.js';


let transporter: nodemailer.Transporter;

if (process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
  });
} else {
  transporter = nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true
  });
}

export async function sendMail(to: string, subject: string, text: string) {
  const info = await transporter.sendMail({ from: config.emailFrom, to, subject, text });
  if ('message' in info) {
    console.log('Email preview:\n', info.message?.toString());
  } else {
    console.log('Email sent:', info.messageId);
  }
}
