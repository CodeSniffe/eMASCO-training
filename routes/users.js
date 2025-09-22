const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  deleteUser
} = require('../controllers/userController');

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.delete('/:id', deleteUser);

module.exports = router;
