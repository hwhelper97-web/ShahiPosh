import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function sendDigitalReceipt() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const receiptHtml = `
    <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 700px; margin: 40px auto; background: #fff; border: 1px solid #e2e8f0; border-radius: 32px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);">
      
      <!-- Premium Header -->
      <div style="background: #000; padding: 60px 40px; text-align: center; position: relative;">
        <h1 style="color: #c5a059; margin: 0; letter-spacing: 8px; font-weight: 900; font-size: 32px; text-transform: uppercase;">SHAHIPOSH</h1>
        <p style="color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 4px; font-size: 10px; margin-top: 12px;">The Epitome of Craftsmanship</p>
        <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, transparent, #c5a059, transparent);"></div>
      </div>

      <div style="padding: 50px;">
        
        <!-- Business & Order Meta -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 50px; border-bottom: 1px solid #f1f5f9; padding-bottom: 30px;">
          <div style="width: 50%;">
            <p style="font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px;">Issued By</p>
            <p style="font-size: 14px; font-weight: 700; color: #1e293b; margin: 0;">SHAHIPOSH LUXURY RETAIL</p>
            <p style="font-size: 13px; color: #64748b; margin: 4px 0;">Main Boulevard, Gulberg III</p>
            <p style="font-size: 13px; color: #64748b; margin: 0;">Lahore, Pakistan • NTN: 7429184-1</p>
          </div>
          <div style="width: 50%; text-align: right;">
            <p style="font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px;">Invoice Details</p>
            <p style="font-size: 14px; font-weight: 700; color: #1e293b; margin: 0;">INV-SHP-774921</p>
            <p style="font-size: 13px; color: #64748b; margin: 4px 0;">Date: April 25, 2026</p>
            <p style="font-size: 13px; color: #22c55e; font-weight: 700; margin: 0;">Status: PAID</p>
          </div>
        </div>

        <!-- Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 15px 0; border-bottom: 2px solid #1e293b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Description</th>
              <th style="text-align: center; padding: 15px 0; border-bottom: 2px solid #1e293b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Qty</th>
              <th style="text-align: right; padding: 15px 0; border-bottom: 2px solid #1e293b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 25px 0; border-bottom: 1px solid #f1f5f9;">
                <p style="margin: 0; font-size: 15px; font-weight: 700; color: #0f172a;">Zardozi Bridal Collection - Emerald Silk</p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #64748b;">Custom tailoring included • Hand-stitched</p>
              </td>
              <td style="padding: 25px 0; border-bottom: 1px solid #f1f5f9; text-align: center; font-size: 14px; color: #0f172a;">01</td>
              <td style="padding: 25px 0; border-bottom: 1px solid #f1f5f9; text-align: right; font-size: 15px; font-weight: 800; color: #0f172a;">Rs. 85,000</td>
            </tr>
          </tbody>
        </table>

        <!-- Totals -->
        <div style="margin-left: auto; width: 300px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="font-size: 14px; color: #64748b;">Subtotal</span>
            <span style="font-size: 14px; font-weight: 600; color: #1e293b;">Rs. 85,000</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="font-size: 14px; color: #64748b;">Shipping & Handling</span>
            <span style="font-size: 14px; font-weight: 600; color: #10b981;">FREE</span>
          </div>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #94a3b8;">Final Amount</span>
            <span style="font-size: 28px; font-weight: 900; color: #c5a059;">Rs. 85,000</span>
          </div>
        </div>

        <!-- Support Info -->
        <div style="margin-top: 60px; padding: 30px; background: #f8fafc; border-radius: 20px; text-align: center;">
          <p style="font-size: 13px; color: #475569; margin: 0;">This is a digitally generated receipt and serves as proof of purchase.</p>
          <div style="margin-top: 15px;">
            <a href="mailto:info@shahiposh.com" style="color: #c5a059; text-decoration: none; font-size: 13px; font-weight: 700; margin: 0 10px;">info@shahiposh.com</a>
            <span style="color: #cbd5e1;">•</span>
            <a href="tel:+923001234567" style="color: #c5a059; text-decoration: none; font-size: 13px; font-weight: 700; margin: 0 10px;">+92 300 1234567</a>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div style="background: #f1f5f9; padding: 30px; text-align: center;">
        <p style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; margin: 0; font-weight: 700;">Thank you for choosing ShahiPosh</p>
      </div>
    </div>
  `;

  console.log('Sending Master Digital Receipt to abidtanha1@gmail.com...');
  
  await transporter.sendMail({
    from: `"SHAHIPOSH Luxury Retail" <${process.env.SMTP_FROM}>`,
    to: 'abidtanha1@gmail.com',
    subject: 'Digital Receipt - SHAHIPOSH Luxury Retail (INV-SHP-774921)',
    html: receiptHtml,
  });

  console.log('✅ Master Digital Receipt sent successfully.');
}

sendDigitalReceipt().catch(console.error);
