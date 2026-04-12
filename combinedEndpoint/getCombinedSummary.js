const Orders = require('../Orders/Order Model/OrderModel');
const RunningCosts = require('../RunningCost/RunningCostModel');

exports.getCombinedDailySummaries = async (req, res) => {
    try {
        // Run both aggregations in parallel for better performance
        const [orders, costs] = await Promise.all([
            Orders.aggregate([
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
                    $sort: { "_id": 1 }
                }
            ]),
            RunningCosts.aggregate([
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                        },
                        totalRunningCost: { $sum: "$price" },
                        costCount: { $sum: 1 }
                    }
                },
                {
                    $sort: { "_id": 1 }
                }
            ])
        ]);

        // Create a map of running costs by date for easier lookup
        const costsByDate = costs.reduce((acc, cost) => {
            acc[cost._id] = cost;
            return acc;
        }, {});

        // Combine the data into a single array
        const combinedSummaries = orders.map(order => {
            const cost = costsByDate[order._id] || { totalRunningCost: 0, costCount: 0 };
            const netProfit = order.totalProfit - cost.totalRunningCost;
            
            return {
                date: order._id,
                totalRevenue: order.totalRevenue,
                totalMakingCost: order.totalMakingCost,
                totalProfit: order.totalProfit,
                orderCount: order.orderCount,
                totalRunningCost: cost.totalRunningCost,
                costCount: cost.costCount,
                netProfit: netProfit
            };
        });

        // Add any dates that have costs but no orders
        Object.keys(costsByDate).forEach(date => {
            if (!orders.find(order => order._id === date)) {
                const cost = costsByDate[date];
                combinedSummaries.push({
                    date: date,
                    totalRevenue: 0,
                    totalMakingCost: 0,
                    totalProfit: 0,
                    orderCount: 0,
                    totalRunningCost: cost.totalRunningCost,
                    costCount: cost.costCount,
                    netProfit: -cost.totalRunningCost // Net loss when no orders
                });
            }
        });

        // Sort by date
        combinedSummaries.sort((a, b) => b.date.localeCompare(a.date));

        res.status(200).json({
            success: true,
            combinedSummaries: combinedSummaries
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching combined daily summaries",
            error: error.message
        });
    }
};