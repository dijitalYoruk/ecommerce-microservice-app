// imports
import JWT from '../util/jwt';
import keys from '../util/keys';
import Password from '../util/password';
import { Request, Response } from 'express';
import Email from '../services/emailService';
import { generateToken } from '../util/util';
import BadRequestError from '../errors/badRequestError';
import NotAuthorizedError from '../errors/notAuthorizedError';
import { RequestSignUpJWT, RequestSignInJWT } from '../requests/auth';

// model
import { __ } from 'i18n';
import User from '../models/user';

// methods

let signUp = async (req: Request, res: Response) => {
   const body: RequestSignUpJWT = req.body;
   const verificationToken = generateToken();

   const user = User.build({
      ...body,
      verificationToken,
      verificationExpires: Date.now() + 1000 * 60 * 60 * 15,
      authType: keys.AUTH_TYPE_PASSWORD,
   });

   await user.save();
   await Email.sendVerificationEmail(user.email, verificationToken);

   res.status(200).json({
      status: 200,
      data: { message: __('success_registration') },
   });
};

let signIn = async (req: Request, res: Response) => {
   // parsing body
   const body: RequestSignInJWT = req.body;

   // checking whether user exists in db.
   const user = await User.findOne({
      $or: [{ email: body.usernameOrEmail }, { username: body.usernameOrEmail }],
   });

   // check user existence
   if (!user) {
      throw new NotAuthorizedError(__('error_invalid_credentials'));
   }

   if (!user.isVerified) {
      throw new NotAuthorizedError(__('error_user_not_verified'));
   }

   if (!user.password) {
      throw new NotAuthorizedError(__('error_wrong_auth_type', user.authType, user.authType));
   }

   // checking whether the passwords match with each other.
   const isPasswordCorrect = await Password.compare(body.password, user.password!);

   if (!isPasswordCorrect) {
      throw new NotAuthorizedError(__('error_invalid_credentials'));
   }

   // generating corrsponding JWT token
   const { _id: id, email, username } = user;
   const token = JWT.generate({ id, email, username });

   res.status(200).json({
      status: 200,
      data: { token, user },
   });
};

const verifyUser = async (req: Request, res: Response) => {
   const verificationToken = req.query.token as string;
   const user = await User.findOne({ verificationToken });

   if (!user) {
      throw new NotAuthorizedError(__('error_invalid_token'));
   }

   const expireDate = user.verificationExpires!;
   user.verificationExpires = undefined;
   user.verificationToken = undefined;

   // verification token is expired
   if (expireDate < Date.now()) {
      await user.save();
      throw new NotAuthorizedError(__('error_expired_token'));
   }

   user.isVerified = true;
   await user.save();
   await Email.sendRegistrationEmail(user.email);

   res.status(200).send({
      status: 200,
      data: { message: __('success_user_verified') },
   });
};

const resendVerificationEmail = async (req: Request, res: Response) => {
   const { email } = req.body;
   const user = await User.findOne({ email });

   if (!user) {
      throw new BadRequestError(__('error_not_found', __('user')));
   }

   if (user.isVerified) {
      throw new BadRequestError(__('error_user_already_verified'));
   }

   user.verificationToken = generateToken();
   user.verificationExpires = Date.now() + 1000 * 60 * 60 * 15;

   await user.save();
   await Email.sendVerificationEmail(user.email, user.verificationToken);

   res.status(200).json({
      status: 200,
      data: { message: __('success_verification_resend') },
   });
};

const forgotPassword = async (req: Request, res: Response) => {
   const { usernameOrEmail } = req.body;

   // checking whether user exists in db.
   const user = await User.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
   });

   if (!user) {
      throw new BadRequestError(__('error_not_found', __('user')));
   }

   if (!user.isVerified) {
      throw new BadRequestError(__('error_not_verified'));
   }

   user.passwordResetToken = generateToken();
   user.passwordResetExpires = Date.now() + 1000 * 60 * 60 * 15;

   await user.save();
   await Email.sendForgotPasswordEmail(user.email, user.passwordResetToken);

   res.status(200).json({
      status: 200,
      data: { message: __('success_password_reset_email') }
   });
};

const resetPassword = async (req: Request, res: Response) => {
   const { password, passwordConfirm, token } = req.body;
   const user = await User.findOne({ passwordResetToken: token });

   if (!user) {
      throw new BadRequestError(__('error_not_found', __('user')));
   }

   const expireDate = user.passwordResetExpires!;
   user.passwordResetExpires = undefined;
   user.passwordResetToken = undefined;

   // token is expired
   if (expireDate < Date.now()) {
      await user.save();
      throw new NotAuthorizedError(__('error_expired_token'));
   }

   user.password = password;
   user.passwordConfirm = passwordConfirm;
   await user.save();

   res.status(200).json({
      status: 200,
      data: { message: __('entity_updated', __('Password')) }
   });
};

export { signUp, signIn, verifyUser, resendVerificationEmail, forgotPassword, resetPassword };
