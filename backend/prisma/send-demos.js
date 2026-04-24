import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function sendDemoEmails() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const welcomeHtml = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 20px; overflow: hidden; background: #fff;">
      <div style="background: #000; padding: 40px; text-align: center;">
        <h1 style="color: #c5a059; margin: 0; letter-spacing: 5px; font-weight: 900; font-size: 28px;">SHAHIPOSH</h1>
        <p style="color: #fff; text-transform: uppercase; letter-spacing: 3px; font-size: 10px; margin-top: 10px; opacity: 0.8;">The World of Luxury Craftsmanship</p>
      </div>
      <div style="padding: 40px; line-height: 1.6; color: #333;">
        <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 20px;">Welcome to the Inner Circle.</h2>
        <p style="font-size: 16px; margin-bottom: 25px;">This is a preview of your new customer Welcome Email. It features premium branding and exclusive member details.</p>
        <div style="background: #fcf8f1; border-left: 4px solid #c5a059; padding: 20px; margin-bottom: 30px;">
          <p style="margin: 0; font-size: 14px; font-weight: 600; color: #c5a059;">MEMBER PRIVILEGES ACTIVATED</p>
        </div>
        <a href="#" style="display: inline-block; background: #000; color: #fff; padding: 18px 35px; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Start Exploring</a>
      </div>
    </div>
  `;

  const receiptHtml = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 24px; overflow: hidden; background: #fff;">
      <div style="background: #000; padding: 40px; text-align: center;">
        <h1 style="color: #c5a059; margin: 0; letter-spacing: 5px; font-weight: 900; font-size: 24px;">SHAHIPOSH</h1>
        <p style="color: #fff; text-transform: uppercase; letter-spacing: 2px; font-size: 9px; margin-top: 8px; opacity: 0.7;">Official Order Confirmation</p>
      </div>
      <div style="padding: 40px;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h2 style="font-size: 20px; font-weight: 800; margin: 0;">Order Receipt Preview</h2>
          <p style="color: #666; font-size: 14px; margin-top: 8px;">Order Number: <span style="color: #000; font-weight: 700;">ORD-123456</span></p>
        </div>
        <div style="background: #fcfcfc; border-radius: 16px; padding: 25px; margin-bottom: 40px;">
           <p><strong>Total Amount:</strong> <span style="color: #c5a059; font-weight: 900;">Rs. 25,000</span></p>
        </div>
      </div>
    </div>
  `;

  console.log('Sending demo emails to abidtanha1@gmail.com...');
  
  await transporter.sendMail({
    from: `"SHAHIPOSH System" <${process.env.SMTP_FROM}>`,
    to: 'abidtanha1@gmail.com',
    subject: 'DEMO: Welcome Email Template',
    html: welcomeHtml,
  });

  await transporter.sendMail({
    from: `"SHAHIPOSH System" <${process.env.SMTP_FROM}>`,
    to: 'abidtanha1@gmail.com',
    subject: 'DEMO: Order Receipt Template',
    html: receiptHtml,
  });

  console.log('✅ Demo emails sent successfully.');
}

sendDemoEmails().catch(console.error);
