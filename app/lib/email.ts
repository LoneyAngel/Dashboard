import nodemailer from 'nodemailer';
import crypto from 'crypto';

export function generateOTP(): string {
  // 生成一个 0 到 999999 之间的随机整数
  // randomInt 确保了随机性的均匀分布，避免了 Math.random() 的某些潜在偏向
  const otp = crypto.randomInt(0, 1_000_000);
  
  // 补全 6 位，不足 6 位的前面补 0
  return otp.toString().padStart(6, '0');
}



export async function sendOTP(email: string, code: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "您的身份验证码",
    html: `<b>您的验证码是：${code}</b>，5分钟内有效。`,
  });
}