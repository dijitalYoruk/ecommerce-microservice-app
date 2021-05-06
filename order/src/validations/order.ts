import { __ } from 'i18n';
import { body } from 'express-validator';
import { validateRequest } from '@conqueror-ecommerce/common'
  

export const validateCreateOrder = [
   
   body('productIds')
      .notEmpty()
      .withMessage('Please provide productIds')
      .isArray({ min: 1 })
      .withMessage(__('validation_min_length', __('products'), '1')),

   body('productQuantities')
      .notEmpty()
      .withMessage('Please provide product quantities.')
      .isArray({ min: 1 })
      .withMessage(__('validation_min_length', 'Product quantities', '1'))
      .custom((quantities: number[], { req }) => quantities.length === req.body.productIds?.length)
      .withMessage('Please define quantitiy per product.')
      .custom((quantities: number[]) => quantities.every((quantity: number) => quantity > 0))
      .withMessage('Please define quantities greater than zero.'),

   validateRequest   
]