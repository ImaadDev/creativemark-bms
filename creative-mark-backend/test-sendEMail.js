import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

(async () => {
  try {
    const response = await resend.emails.send({
        from: 'CreativeMark <no-reply@creativemaark.com>', // must be verified in Resend
        to: ['kimad1728@gmail.com'],
        subject: 'hello world',
        html: '<p>it works!</p>',
      });
      
            
    console.log('Email sent successfully:', response.id);
  } catch (err) {
    console.error('Error sending email:', err);
  }
})();
