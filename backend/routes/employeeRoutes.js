// backend/routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.get('/', employeeController.list);
router.get('/:id', employeeController.get);
router.post('/', employeeController.create);
router.put('/:id', employeeController.update);
router.delete('/:id', employeeController.delete);
router.post("/bulk", employeeController.bulkCreate);

// add this if missing:
router.post("/bulk", employeeController.bulkCreate);


module.exports = router;