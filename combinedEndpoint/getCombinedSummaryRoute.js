const express = require('express');
const router = express.Router();

const { getCombinedDailySummaries } = require('./getCombinedSummary');

router.get('/', getCombinedDailySummaries);

module.exports = router;