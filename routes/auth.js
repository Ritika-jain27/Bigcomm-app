const express = require('express'),
router = express.Router(),
BigCommerce = require('node-bigcommerce');

const bigCommerce = new BigCommerce({
clientId: '9yt0q8e668rvkj4pm4f1e5b3lw33zym',
secret: 'c7a654beac88ffaed76c4d20f6952e48a4e25800b2a44bf74c00e462c7279087',
callback: 'https://your-ngrokURL/auth',
responseType: 'json'
});

router.get('/', (req, res, next) => {
bigCommerce.authorize(req.query)
.then(data => console.log(data))
.then(data => res.render('auth', { title: 'Authorized!' })
.catch(err));
});
module.exports = router;
