//---- SWAGGER -----
import { authSchema } from './auth/auth.schema'
import { userSchema } from './user/user.schema'
import { propertySchema } from './property/property.schema'
import { inquirySchema } from './inquiry/inquiry.schema'
import { bookingSchema } from './booking/booking.schema'
import { paymentSchema } from './payment/payment.schema'

export const schema = {
    ...authSchema,
    ...userSchema,
    ...propertySchema,
    ...inquirySchema,
    ...bookingSchema,
    ...paymentSchema,
}
