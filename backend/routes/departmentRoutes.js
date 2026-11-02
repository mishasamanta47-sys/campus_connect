const router = require('express').Router();
const { verifyToken, adminOnly } = require('../middleware/authMiddleware');
const {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departmentController');

router.get('/', getAllDepartments);
router.get('/:id', getDepartmentById);
router.post('/', verifyToken, adminOnly, createDepartment);
router.put('/:id', verifyToken, adminOnly, updateDepartment);
router.delete('/:id', verifyToken, adminOnly, deleteDepartment);

module.exports = router;

