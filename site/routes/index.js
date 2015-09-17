var express = require('express');
var router = express.Router();

router.get('/edit', function(req, res, next) {
    res.render('edit');
});

module.exports = router;