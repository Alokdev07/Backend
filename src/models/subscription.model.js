import mongoose,{Schema} from "mongoose";

const subscriptionSchema = Schema(
    {
        subscriber : {
            type : Schema.Types.ObjectId, // one who subscribe
            ref  : "User"
        },
        channel : {
            type : Schema.Types.ObjectId, // one whom "subscriber" subscribing
            ref : "User"
        }
    },
    {
        timestamps : true
    }
)

export const Subscription = mongoose.model("Subscription",subscriptionSchema)