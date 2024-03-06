const express = require('express'),
router = express.Router(),
BigCommerce = require('node-bigcommerce');
const bigCommerce = new BigCommerce({
secret: 'c7a654beac88ffaed76c4d20f6952e48a4e25800b2a44bf74c00e462c7279087',
responseType: 'json'
});

router.get('/', (req, next) => {
try {
const data = bigCommerce.verify(req.query['signed_payload']);
console.log(data);
} catch (err) {
next(err);
}
});

module.exports = router;
