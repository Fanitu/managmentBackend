const RunningCost = require('./RunningCostModel')


exports.createNewRunningCost = async(req,res) => {

     console.log('we arrive in Running cost')
    try {
      
        const { costName , amount } = req.body;
        if(!costName || !amount){
            return res.status(400).json({
                        success: false,
                        message: 'Please provide all required fields',
                    });
        }

        const newRunningCost = RunningCost.create({
            name:costName  ,
            price: amount
        })

        res.status(201).json({
            success: true,
            data: newRunningCost,
            message: 'RunningCost created successfully!',
        });
        
    } catch (error) {
        res.status(500).json({
        success: false,
        message: error.message,
    });
        
    }

}

exports.getAllRunningCost = async(req,res) => {
    try {
        const runningCost = await RunningCost.find().sort({createdAt:-1})

        res.status(200).json({
            success:true,
            runningCost: runningCost,
            count: runningCost.length
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Error Fetching orders",
            error:error.message
               
        })
    }
}


// NEW: Get running costs by date range
exports.getRunningCostsByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        let query = {};
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        
        const costs = await RunningCost.find(query).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            runningCosts: costs,
            count: costs.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching running costs by date range",
            error: error.message
        });
    }
};

// NEW: Get daily running cost summaries
exports.getDailyRunningCostSummaries = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        const costs = await RunningCost.aggregate([
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
                    totalRunningCost: { $sum: "$price" },
                    costCount: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": -1 }
            }
        ]);
        
        res.status(200).json({
            success: true,
            dailyRunningCostSummaries: costs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching daily running cost summaries",
            error: error.message
        });
    }
};

// NEW: Get weekly running cost summaries
exports.getWeeklyRunningCostSummaries = async (req, res) => {
    try {
        const costs = await RunningCost.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        week: { $week: "$createdAt" }
                    },
                    totalRunningCost: { $sum: "$price" },
                    costCount: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": -1, "_id.week": -1 }
            }
        ]);
        
        res.status(200).json({
            success: true,
            weeklyRunningCostSummaries: costs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching weekly running cost summaries",
            error: error.message
        });
    }
};

// NEW: Get monthly running cost summaries
exports.getMonthlyRunningCostSummaries = async (req, res) => {
    try {
        const costs = await RunningCost.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    totalRunningCost: { $sum: "$price" },
                    costCount: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": -1, "_id.month": -1 }
            }
        ]);
        
        res.status(200).json({
            success: true,
            monthlyRunningCostSummaries: costs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching monthly running cost summaries",
            error: error.message
        });
    }
};