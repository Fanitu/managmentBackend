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


// NEW: Get orders with date range filtering
exports.getOrdersByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        let query = {};
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        
        const orders = await Orders.find(query).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            orders: orders,
            count: orders.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching orders by date range",
            error: error.message
        });
    }
};

// NEW: Get daily summaries for a date range
exports.getDailySummaries = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        const orders = await Orders.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    totalRevenue: { $sum: "$ordersPrice" },
                    totalMakingCost: { $sum: "$ordersMakingPrice" },
                    totalProfit: { $sum: "$profite" },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": -1 }
            }
        ]);
        
        res.status(200).json({
            success: true,
            dailySummaries: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching daily summaries",
            error: error.message
        });
    }
};

// NEW: Get weekly summaries
exports.getWeeklySummaries = async (req, res) => {
    try {
        const orders = await Orders.aggregate([
            {
                $addFields: {
                    weekStart: {
                        $dateTrunc: {
                            date: "$createdAt",
                            unit: "week",
                            binSize: 1,
                            startOfWeek: "Mon"
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$weekStart",
                    startDate: { $min: "$createdAt" },
                    endDate: { $max: "$createdAt" },
                    totalRevenue: { $sum: "$ordersPrice" },
                    totalMakingCost: { $sum: "$ordersMakingPrice" },
                    totalProfit: { $sum: "$profite" },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $addFields: {
                    year: { $year: "$_id" },
                    week: { $isoWeek: "$_id" }
                }
            },
            {
                $sort: { "_id": -1 }
            }
        ]);

        res.status(200).json({
            success: true,
            weeklySummaries: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching weekly summaries",
            error: error.message
        });
    }
};

// NEW: Get monthly summaries
exports.getMonthlySummaries = async (req, res) => {
    try {
        const orders = await Orders.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    startDate: { $min: "$createdAt" },
                    endDate: { $max: "$createdAt" },
                    totalRevenue: { $sum: "$ordersPrice" },
                    totalMakingCost: { $sum: "$ordersMakingPrice" },
                    totalProfit: { $sum: "$profite" },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": -1, "_id.month": -1 }
            }
        ]);
        
        res.status(200).json({
            success: true,
            monthlySummaries: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching monthly summaries",
            error: error.message
        });
    }
};
