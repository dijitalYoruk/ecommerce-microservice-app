import Stripe from 'stripe'
import keys from '../util/keys'
export default new Stripe(keys.STRIPE_KEY!, { apiVersion: '2020-08-27' }) 