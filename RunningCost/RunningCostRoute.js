const express = require('express');
const router = express.Router();
const { createNewRunningCost,getAllRunningCost,getRunningCostsByDateRange,getDailyRunningCostSummaries,getWeeklyRunningCostSummaries,getMonthlyRunningCostSummaries} = require('./RunningCostController')

router.post('/',createNewRunningCost)
router.get('/',getAllRunningCost);

router.get('/date-range', getRunningCostsByDateRange);
router.get('/daily-summaries', getDailyRunningCostSummaries);
router.get('/weekly-summaries', getWeeklyRunningCostSummaries);
router.get('/monthly-summaries', getMonthlyRunningCostSummaries);



module.exports = router;