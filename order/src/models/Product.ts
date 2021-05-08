import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

// =====================
// Attributes
// =====================
interface ProductAttributes {
   id: string,
   price: number, 
   title: string, 
   quantity?: number,
   placeholder: string, 
   isQuantityRestricted: boolean
}

// =====================
// Product Model
// =====================
interface ProductModel extends mongoose.PaginateModel<ProductDoc> {
   build(attr: ProductAttributes): ProductDoc
   findByEvent(data: { id: string, version: number }): ProductDoc
}

// =====================
// Product Document
// =====================
export interface ProductDoc extends mongoose.Document {
   id: string,
   price: number, 
   title: string, 
   version: number,
   quantity: number,
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
   placeholder: {
      type: String,
      required:  [true, 'Placeholder is missing']
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
   }
},{
   timestamps: true, 
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
ProductSchema.pre('save', function(next) {
   const version = this.get('version');
   if (!version) next()
   this.set('version', version+1)
})

ProductSchema.statics.build = (attr: ProductAttributes) => {
   return new Product({ _id: attr.id, ...attr});
}

ProductSchema.statics.findByEvent = async (data: { id: string, version: number }) => {
   const { id, version } = data
   return await Product.findOne({ _id: id, version: version-1 })
}

ProductSchema.plugin(mongoosePaginate)
ProductSchema.set('versionKey', 'version')
const Product = mongoose.model<ProductDoc, ProductModel>('Product', ProductSchema)
export default Product