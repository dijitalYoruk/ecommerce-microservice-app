import { OrderDoc } from './Order';
import mongoose, { Schema } from 'mongoose';

// =====================
// Attributes
// =====================
interface PaymentAttributes {
    order: string,
    amount: number,
    stripeId: string
}

// =====================
// Order Model
// =====================
interface PaymentModel extends mongoose.Model<PaymentDoc> {
    build(attr: PaymentAttributes): PaymentDoc
}

// =====================
// Order Document
// =====================
export interface PaymentDoc extends mongoose.Document {
    id: string,
    amount: number,
    version: number;
    stripeId: string,
    order: string | OrderDoc,
}

// =====================
// Schema
// =====================
const PaymentSchema = new Schema({
    order: {
        ref: 'Order',
        type: Schema.Types.ObjectId,
        required: [true, 'Order is missing'],
    },
    amount: {
        type: Number,
        required: [true, 'Amount is missing'],
    },
    stripeId: {
        type: String,
        required: [true, 'Stripe id is missing'],
    },
}, {
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
PaymentSchema.statics.build = (attr: PaymentAttributes) => {
    return new Payment(attr);
}

PaymentSchema.pre('save', function (next) {
    const version = this.get('version');
    if (!version) next()
    this.set('version', version + 1)
})

PaymentSchema.set('versionKey', 'version')
const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', PaymentSchema)
export default Payment