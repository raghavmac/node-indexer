var express = require('express');
var router = express.Router();
var sampleController = require('../controllers/sampleController.js');

/*
 * POST
 */
router.post('/index', function (req, res) {
  sampleController.create(req, res);
});

/*
 * GET
 */
router.get('/index', function (req, res) {
  sampleController.list(req, res);
});

/*
 * GET
 */
router.get('/search/:keyword', function (req, res) {
  sampleController.search(req, res);
});

module.exports = router;
