const express = require('express');
const router = express.Router();
const { createNewOrder,getAllOrders,getOrdersByDateRange,getDailySummaries,getWeeklySummaries,getMonthlySummaries} = require('../OrderController/OrderController')

router.post('/',createNewOrder);
router.get('/',getAllOrders);
router.get('/date-range',getOrdersByDateRange);
router.get('/daily-summaries', getDailySummaries);
router.get('/weekly-summaries',getWeeklySummaries);
router.get('/monthly-summaries',getMonthlySummaries);


module.exports = router;