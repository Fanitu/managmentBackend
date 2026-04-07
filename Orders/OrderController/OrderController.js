const Orders = require('../Order Model/OrderModel')
const actualPriceForm = require('../../ActualPrice/actualprice')


exports.createNewOrder = async(req,res) => {
    try {
        console.log('controller arrived')
        
        console.log(req.body);
        const { orderType , quantity } = req.body;
        if(!orderType || !quantity){
            return res.status(400).json({
                        success: false,
                        message: 'Please provide all required fields',
                    });
        }

        const profite = quantity - actualPriceForm[orderType];

        const newOrder = Orders.create({
            ordersName: orderType ,
            ordersPrice: quantity,
            ordersMakingPrice: actualPriceForm[orderType],
            profite:profite
        })

        res.status(201).json({
            success: true,
            data: newOrder,
            message: 'Order created successfully!',
        });
        
    } catch (error) {
        res.status(500).json({
        success: false,
        message: error.message,
    });
        
    }

}

exports.getAllOrders = async(req,res) => {
    console.log('we arrive in orders')
    try {
        const orders = await Orders.find().sort({createdAt:-1})
        const totalOrders = await orders.length;
         console.log('we arrive in getting orders')

        res.status(200).json({
            success:true,
            orders: orders,
            count: orders.length,
            totalOrders:totalOrders
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Error Fetching orders",
            error:error.message
               
        })
    }
}