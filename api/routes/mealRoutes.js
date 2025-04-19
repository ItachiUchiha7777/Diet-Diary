const express = require('express');
const {
  getMeals,
  getMealsByDate,
  getMeal,
  addMeal,
  updateMeal,
  deleteMeal,
} = require('../controllers/mealController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getMeals)
  .post(protect, addMeal);

router.route('/date/:date')
  .get(protect, getMealsByDate);

router.route('/:id')
  .get(protect, getMeal)
  .put(protect, updateMeal)
  .delete(protect, deleteMeal);

module.exports = router;