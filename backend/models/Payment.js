const mongoose = require('mongoose');


const paymentSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    payment_id:{
        type:String,
        required:true
    },
    payment_amount:{
        type:Number,
        required:true
    }
},{timestamps:true});
const Payment =mongoose.model('Payment', paymentSchema);
module.exports = Payment