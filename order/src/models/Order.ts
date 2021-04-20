import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { OrderStatus } from '@conqueror-ecommerce/common';
import { ProductDoc } from './Product';

// =====================
// Attributes
// =====================
interface OrderAttributes {
   expiresAt: Date;
   customer: string;
   status: OrderStatus;
   products: ProductDoc[];
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
   version: number;
   expiresAt: Date;
   customer: string;
   status: OrderStatus;
   products: ProductDoc[];
}

// =====================
// Schema
// =====================
const OrderSchema = new Schema({
   expiresAt: { 
      type: Schema.Types.Date,
   },
   status: {
      type: String,
      required: [true, 'Order status is missing'],
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
   },
   products: [{
      type: Schema.Types.ObjectId,
      required:  [true, 'Product is missing'],
      ref: 'Product',
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

OrderSchema.statics.build = (attr: OrderAttributes) => {
   return new Order(attr);
}

OrderSchema.plugin(mongoosePaginate)
const Order = mongoose.model<OrderDoc, OrderModel>('Order', OrderSchema)
export default Order