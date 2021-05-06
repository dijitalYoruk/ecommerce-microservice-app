import { __ } from 'i18n';
import { body } from 'express-validator';
import { validateRequest } from '@conqueror-ecommerce/common'

export const validateCreateProduct = [
   
   body('title')
      .trim()
      .notEmpty()
      .withMessage(__('validation_request', __('Title'))),
   
   body('description')
      .trim()
      .isLength({ min: 50 })
      .withMessage(__('validation_min_length', __('description'), '50')),

   body('isQuantityRestricted')
      .isBoolean()
      .withMessage('Please specify whether the product is quantity restricted.'),

   body('quantity')
      .custom((quantity, {req}) => (req.body.isQuantityRestricted && quantity > 0) || !req.body.isQuantityRestricted)
      .withMessage('Please specify product quantity restricted.'),

   body('placeholder')
      .notEmpty()
      .withMessage(__('validation_request', __('placeholder'))),
   
   body('price')
      .isFloat({ gt: 0 })
      .withMessage(__('invalid', __('price'))),

   validateRequest   
]

export const validateUpdateProduct = [
   
   body('productId')
      .notEmpty()
      .withMessage(__('validation_request', __('Product'))),

   body('title')
      .if(body('title').exists())
      .notEmpty()
      .withMessage(__('validation_request', __('Title'))),
   
   body('placeholder')
      .if(body('placeholder').exists())
      .notEmpty()
      .withMessage(__('validation_request', __('placeholder'))),
   
   body('description')
      .if(body('description').exists())
      .trim()
      .isLength({ min: 50 })
      .withMessage(__('validation_min_length', __('description'), '50')),
   
   body('price')
      .if(body('price').exists())
      .isFloat({ gt: 0 })
      .withMessage(__('invalid', __('price'))),
      
   validateRequest   
]

export const validateDeleteProduct = [
   
   body('productId')
      .notEmpty()
      .withMessage(__('validation_request', __('productId'))),
   
   validateRequest   
]