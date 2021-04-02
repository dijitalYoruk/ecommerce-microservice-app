import { __ } from 'i18n';
import { body } from 'express-validator';
import { validateRequest } from '@conqueror-ecommerce/common'

export const validateSignUp = [
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
   
   validateRequest   
]

export const validateSignIn = [
   body('usernameOrEmail')
      .notEmpty()
      .withMessage(__('validation_request', `${__('username')} ${__('or')} ${__('email')}`)),
   
   body('password')
      .isLength({ min: 8 })
      .withMessage(__('validation_min_length', __('password'), '8')),
   
   validateRequest   
]

export const validateSignInGoogle = [
   body('code')
      .notEmpty()
      .withMessage(__('validation_request', __('authentication_code'))),

   validateRequest   
]

export const validateSignInFacebook = [
   body('code')
      .notEmpty()
      .withMessage(__('validation_request', __('authentication_code'))),

   validateRequest   
]

export const validateSignInGithub = [
   body('code')
      .notEmpty()
      .withMessage(__('validation_request', __('authentication_code'))),
   
   validateRequest   
]

export const validateVerification = [
   body('token')
      .notEmpty()
      .withMessage(__('validation_request', __('token'))),
   validateRequest   
]


export const validateResendVerification = [
   body('email')
      .isEmail()
      .withMessage(__('validation_request', __('email'))),
   validateRequest   
]


export const validateForgotPassword = [
   body('usernameOrEmail')
      .notEmpty()
      .withMessage(__('validation_request', `${__('username')} ${__('or')} ${__('email')}`)),
   validateRequest
]

export const validateResetPassword = [
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
   
   validateRequest      
]