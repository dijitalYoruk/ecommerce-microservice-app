import { __ } from 'i18n';
import { body } from 'express-validator';
import { validateRequest } from '@conqueror-ecommerce/common'
  

export const validateCreateOrder = [
   
   body('productIds')
      .isArray({ min: 1})
      .notEmpty()
      .withMessage(__('validation_min_length', __('products'), '1')),

   validateRequest   
]