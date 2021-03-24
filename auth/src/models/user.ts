import keys from '../util/keys'
import Password from '../util/password'
import mongoose, { Schema } from 'mongoose';

// =====================
// Attributes
// =====================
interface UserAttributes {
   email: string,
   username: string,
   authType: string,
   password?: string,
   isVerified?: boolean,
   passwordConfirm?: string,
   verificationToken?: string,
   verificationExpires?: number,
}

// =====================
// User Model
// =====================
interface UserModel extends mongoose.Model<UserDoc> {
   build(attr: UserAttributes): UserDoc
}

// =====================
// User Document
// =====================
export interface UserDoc extends mongoose.Document {
   email: string,
   username: string,
   authType: string,
   createdAt: string,
   updatedAt: string,
   password?: string,
   isVerified: boolean,
   passwordConfirm?: string,
   verificationToken?: string,
   passwordResetToken?: string,
   verificationExpires?: number,
   passwordResetExpires?: Number,
}

// =====================
// Schema
// =====================
const UserSchema = new Schema({
   username: {
      type: String,
      unique: [true, 'Username needs to be unique'],
      required: [true, 'Username is missing'],
      trim: true
   },  
   email: {
      type: String,
      unique: [true, 'Email needs to be unique'], 
      required:  [true, 'Email is missing'],
   },
   authType: {
      type: String,
      required:  [true, 'Authentication Type is missing'],
      enum: [
         keys.AUTH_TYPE_PASSWORD, 
         keys.AUTH_TYPE_GOOGLE, 
         keys.AUTH_TYPE_GITHUB, 
         keys.AUTH_TYPE_FACEBOOK
      ]
   },
   password: {
      type: String,
      trim: true,
      minlength: 10,
   },
   isVerified: {
      type: Boolean,
      default: false
   },
   verificationToken: String,
   verificationExpires: Number,
   passwordResetToken: String,
   passwordResetExpires: Number,
   passwordConfirm: {
      type: String,
      trim: true,
      validate: {
         validator(value: string) { return value === this.password },
         message: 'Passwords do not match.'
      } 
   }
}, {
   timestamps: true, 
   versionKey: false,
   toJSON: {
      transform(doc, ret) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.authType;
         delete ret.password;
         delete ret.isVerified;
      }
   }
})

// =====================
// Hooks
// ===================== 
UserSchema.pre('save', async function(next) {
   // changing password
   if (!this.isModified('password')) {
      return next()
   }
   
   const password = this.get('password')
   const hashedPassword = await Password.hash(password)
   this.set('password', hashedPassword)
   this.set('passwordConfirm', undefined)
   next()
})

UserSchema.statics.build = (attr: UserAttributes) => {
   return new User(attr);
}

const User = mongoose.model<UserDoc, UserModel>('User', UserSchema)
export default User