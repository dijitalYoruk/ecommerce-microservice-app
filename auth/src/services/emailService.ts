import ejs from 'ejs';
import path from 'path';
import Keys from '../util/keys';
import sgMail from '@sendgrid/mail';
import { EmailServiceError } from '@conqueror-ecommerce/common'

sgMail.setApiKey(Keys.SG_API_KEY!);

export default class Email {

   public static async sendVerificationEmail(email: string, verificationToken: string) {
      const subject = 'Email Verification';
      const template = path.join(__dirname, '../views/emails/signUpVerification.ejs')
      const html = await ejs.renderFile(template, { token: verificationToken });
      await Email.sendMail(email, subject, html)
   }

   public static async sendForgotPasswordEmail(email: string, passwordResetToken: string) {
      const subject = 'Forgot Password';
      const template = path.join(__dirname, '../views/emails/forgotPassword.ejs')
      const html = await ejs.renderFile(template, { token: passwordResetToken });
      await Email.sendMail(email, subject, html)
   }

   public static async sendRegistrationEmail(email: string) {
      const subject = 'Hello to App';
      const template = path.join(__dirname, '../views/emails/signUpGreeting.ejs')
      const html = await ejs.renderFile(template);
      await Email.sendMail(email, subject, html)
   }

   private static async sendMail(to: string, subject: string, html: string, text: string = '-') {
      if (process.env.NODE_ENV === 'test') return;
      const from = Keys.SG_SENDER_EMAIL!
      const email = { from, to, subject, text, html }; 

      try {
         await sgMail.send(email)
      } catch (exception) {
         throw new EmailServiceError()
      }
   }

} 