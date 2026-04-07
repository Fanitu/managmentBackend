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