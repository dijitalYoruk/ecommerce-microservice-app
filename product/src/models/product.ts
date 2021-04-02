import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

// =====================
// Attributes
// =====================
interface ProductAttributes {
   price: number, 
   title: string, 
   authorId: string,
   description: string, 
   placeholder: string, 
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
   price: number, 
   title: string, 
   authorId: string,
   description: string, 
   placeholder: string, 
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
   description: {
      type: String,
      required:  [true, 'Description is missing'],
   },
   price: {
      type: Number,
      required:  [true, 'Price is missing']
   },
   placeholder: {
      type: String,
      required:  [true, 'Placeholder is missing']
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