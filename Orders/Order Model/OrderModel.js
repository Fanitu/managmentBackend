const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    ordersName:{
        type:String,
        required:true
    },

    ordersPrice:{
        type:Number,
        required:true
    },

    ordersMakingPrice:{
        type:Number,
        required:true
    },

    profite:{
        type:Number,
        required:true
    }
},{
    timestamps:true
})


module.exports = mongoose.model('Orders', OrderSchema);