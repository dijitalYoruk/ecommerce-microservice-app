import { __ } from 'i18n';
import { body } from 'express-validator';
import { extractValidationErrors } from '../util/util'

const validateSignUpJWT = [
   body('email')
      .isEmail()
      .withMessage(__('validation_request', __('email'))),
   
   body('username')
      .notEmpty()
      .withMessage(__('validation_request', __('password'))),
   
   body('password')
      .isLength({ min: 8 })
      .withMessage(__('validation_min_length', __('password'), '8')),
  
   body('passwordConfirm')
      .notEmpty()
      .withMessage('Password Confirmation is required.')
      .custom((value: string, { req }) => value === req.body.password)
      .withMessage('Passwords do not match.'),
   
   extractValidationErrors   
]

const validateSignInJWT = [
   body('usernameOrEmail')
      .notEmpty()
      .withMessage(__('validation_request', `${__('username')} ${__('or')} ${__('email')}`)),
   
   body('password')
      .isLength({ min: 8 })
      .withMessage(__('validation_min_length', __('password'), '8')),
   
   extractValidationErrors   
]

const validateSignInGoogle = [
   body('code')
      .notEmpty()
      .withMessage(__('validation_request', __('authentication_code'))),
   extractValidationErrors   
]

const validateSignInFacebook = [
   body('code')
      .notEmpty()
      .withMessage(__('validation_request', __('authentication_code'))),
   extractValidationErrors   
]

const validateSignInGithub = [
   body('code')
      .notEmpty()
      .withMessage(__('validation_request', __('authentication_code'))),
   extractValidationErrors   
]

const validateVerification = [
   body('token')
      .notEmpty()
      .withMessage(__('validation_request', __('token'))),
   extractValidationErrors   
]


const validateResendVerification = [
   body('email')
      .isEmail()
      .withMessage(__('validation_request', __('email'))),
   extractValidationErrors   
]


const validateForgotPassword = [
   body('usernameOrEmail')
      .notEmpty()
      .withMessage(__('validation_request', `${__('username')} ${__('or')} ${__('email')}`)),
   extractValidationErrors   
]

const validateResetPassword = [
   body('token')
      .notEmpty()
      .withMessage(__('validation_request', __('token'))),

   body('password')
      .isLength({ min: 8 })
      .withMessage(__('validation_min_length', __('password'), '8')),
  
   body('passwordConfirm')
      .notEmpty()
      .withMessage('Password Confirmation is required.')
      .custom((value: string, { req }) => value === req.body.password)
      .withMessage('Passwords do not match.'),
   
   extractValidationErrors   
]

export {
   validateSignInJWT,
   validateSignUpJWT,
   validateVerification,
   validateSignInGithub,
   validateSignInGoogle,
   validateResetPassword,
   validateSignInFacebook,
   validateForgotPassword,
   validateResendVerification,
}