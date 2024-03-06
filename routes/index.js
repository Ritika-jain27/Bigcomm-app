var express = require('express');
var router = express.Router();
const fs = require('fs/promises');
const multer = require('multer'); // Import multer
const axios = require('axios');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Replace with your desired upload directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const ExcelJS = require('exceljs');
const workbook = new ExcelJS.Workbook();

// Create the upload middleware
const upload = multer({ storage: storage });

router.post('/upload', upload.single('productFile'), async (req, res) => {
  console.info("upload api called");
  try {
    // Read uploaded file
    const filePath = req.file.path;
    const XLSX = require('xlsx');
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet

    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    console.info('sheetData', sheetData[1]);

    for (let product of sheetData) {
      let productdata = {
        'name': product['Product Name'],
        'type': 'physical',
        'weight': product.Weight,
        'price': product.ListPrice,
      }
      try {
        const createdProduct = createProduct(productdata);
        console.log('Product created:', createdProduct);
      } catch (error) {
        console.error('Failed to create product:', error);
      }
    }
    res.send('Products created!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error during upload or product creation');
  } finally {
    // Clean up uploaded file (optional, as Multer handles deletion by default)
    // await fs.unlink(req.file.path);
  }
});


async function createProduct(productData) {
  try {
    console.info('productData', productData);
    const response = await axios.post(
      `https://api.bigcommerce.com/stores/jm50axyq3q/v3/catalog/products`,
      productData,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': 'e9dq55yzrkbc4jjqicq1mai4e53ltjq',
          'Accept': 'application/json',
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error.response.data);
    throw error;
  }
}
module.exports = router;
