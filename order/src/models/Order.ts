import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { OrderStatus } from '@conqueror-ecommerce/common';
import { ProductDoc } from './Product';
import { PaymentDoc } from './Payment';

// =====================
// Attributes
// =====================
interface OrderAttributes {
   expiresAt: Date;
   version?: number;
   customer: string;
   status: OrderStatus;
   products: { 
      quantity: number,
      product: string,
      unitSellPrice: number 
   }[];
}

// =====================
// Order Model
// =====================
interface OrderModel extends mongoose.PaginateModel<OrderDoc> {
   build(attr: OrderAttributes): OrderDoc
}

// =====================
// Order Document
// =====================
export interface OrderDoc extends mongoose.Document {
   id: string,
   version: number;
   expiresAt: Date;
   customer: string;
   status: OrderStatus;
   payment?: string | PaymentDoc,
   products: {
      quantity: number,
      product: string | ProductDoc,
      unitSellPrice: number,
   }[];
}

// =====================
// Schema
// =====================
const OrderSchema = new Schema({
   expiresAt: { 
      type: Schema.Types.Date,
      required: [true, 'Expiration Date is missing.']
   },
   status: {
      type: String,
      required: [true, 'Order status is missing'],
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
   },
   payment: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
      required: [
         function() { return this.get('status') === OrderStatus.Completed }, 
         'Payment is required.'
      ]
   },
   products: [{
      product: {
         type: Schema.Types.ObjectId,
         required:  [true, 'Product is missing'],
         ref: 'Product',
      },
      unitSellPrice: {
         type: Number,
         required:  [true, 'Unit price of the product is missing'],
      },
      quantity: {
         type: Number,
         required:  [true, 'Quantity of a product is missing'],
      }
   }],
   customer: {
      type: String,
      required:  [true, 'Customer is missing']
   }
},{
   timestamps: true, 
   toJSON: {
      transform(doc, ret) {
         ret.id = ret._id;
         delete ret._id;
      }
   }
})


// =====================
// Methods
// =====================
OrderSchema.statics.build = (attr: OrderAttributes) => {
   return new Order(attr);
}

OrderSchema.pre('save', function(next) {
   const version = this.get('version');
   if (!version) next()
   this.set('version', version+1)
})

OrderSchema.plugin(mongoosePaginate)
OrderSchema.set('versionKey', 'version')
const Order = mongoose.model<OrderDoc, OrderModel>('Order', OrderSchema)
export default Order