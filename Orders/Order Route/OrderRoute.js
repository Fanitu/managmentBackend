const express = require('express');
const router = express.Router();
const { createNewOrder,getAllOrders } = require('../OrderController/OrderController')

router.route('/')
.post(createNewOrder)
.get(getAllOrders);


module.exports = router;