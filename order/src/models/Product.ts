import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

// =====================
// Attributes
// =====================
interface ProductAttributes {
   price: number, 
   title: string, 
   quantity: number,
   authorId: string,
   description: string, 
   placeholder: string, 
   isQuantityRestricted: boolean
}

// =====================
// Product Model
// =====================
interface ProductModel extends mongoose.PaginateModel<ProductDoc> {
   build(attr: ProductAttributes): ProductDoc
}

// =====================
// Product Document
// =====================
export interface ProductDoc extends mongoose.Document {
   id: string,
   price: number, 
   title: string, 
   quantity: number,
   authorId: string,
   description: string, 
   placeholder: string, 
   isQuantityRestricted: boolean
}

// =====================
// Schema
// =====================
const ProductSchema = new Schema({
   title: {
      type: String,
      required: [true, 'Title is missing'],
      trim: true
   },  
   price: {
      type: Number,
      required:  [true, 'Price is missing']
   },
   isQuantityRestricted: {
      type: Boolean,
      required:  [true, 'isQuantityRestricted is missing']
   },
   quantity: {
      type: Number,
      min: [0, 'Quantity needs to be at least zero.'],
      required: [
         function() { return this.get('isQuantityRestricted') }, 
         'Quantity is required'
      ]
   },
   authorId: {
      type: String,
      required:  [true, 'Author is missing']
   }
},{
   timestamps: true, 
   versionKey: false,
   toJSON: {
      transform(doc, ret) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.authorId;
      }
   }
})

// =====================
// Hooks
// ===================== 
ProductSchema.statics.build = (attr: ProductAttributes) => {
   return new Product(attr);
}

ProductSchema.plugin(mongoosePaginate)
const Product = mongoose.model<ProductDoc, ProductModel>('Product', ProductSchema)
export default Product