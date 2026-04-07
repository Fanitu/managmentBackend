const express = require('express');
const router = express.Router();
const { createNewRunningCost,getAllRunningCost } = require('./RunningCostController')

router.route('/')
.post(createNewRunningCost)
.get(getAllRunningCost);



module.exports = router;