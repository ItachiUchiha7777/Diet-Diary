const Meal = require('../models/Meal');
const asyncHandler = require('express-async-handler');

// @desc    Get all meals for a user
// @route   GET /api/meals
// @access  Private
exports.getMeals = asyncHandler(async (req, res, next) => {
  const meals = await Meal.find({ user: req.user.id }).sort('-date');

  res.status(200).json({
    success: true,
    count: meals.length,
    data: meals,
  });
});

// @desc    Get meals by date
// @route   GET /api/meals/date/:date
// @access  Private
exports.getMealsByDate = asyncHandler(async (req, res, next) => {
  const date = new Date(req.params.date);
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);

  const meals = await Meal.find({
    user: req.user.id,
    date: {
      $gte: date,
      $lt: nextDay,
    },
  }).sort('-date');

  res.status(200).json({
    success: true,
    count: meals.length,
    data: meals,
  });
});

// @desc    Get single meal
// @route   GET /api/meals/:id
// @access  Private
exports.getMeal = asyncHandler(async (req, res, next) => {
  const meal = await Meal.findById(req.params.id);

  if (!meal) {
    return res.status(404).json({
      success: false,
      message: 'Meal not found',
    });
  }

  // Make sure user owns the meal
  if (meal.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this meal',
    });
  }

  res.status(200).json({
    success: true,
    data: meal,
  });
});

// @desc    Add new meal
// @route   POST /api/meals
// @access  Private
exports.addMeal = asyncHandler(async (req, res, next) => {
  const { name, date,tag } = req.body;
  
  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a meal name',
    });
  }

  const meal = await Meal.create({
    name,
    tag,
    date: date || Date.now(),
    user: req.user.id,
  });

  res.status(201).json({
    success: true,
    data: meal,
  });
});

// @desc    Update meal
// @route   PUT /api/meals/:id
// @access  Private
exports.updateMeal = asyncHandler(async (req, res, next) => {
  let meal = await Meal.findById(req.params.id);

  if (!meal) {
    return res.status(404).json({
      success: false,
      message: 'Meal not found',
    });
  }

  // Make sure user owns the meal
  if (meal.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to update this meal',
    });
  }

  meal = await Meal.findByIdAndUpdate(
    req.params.id,
    { 
      name: req.body.name,
      date: req.body.date || meal.date 
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: meal,
  });
});

// @desc    Delete meal
// @route   DELETE /api/meals/:id
// @access  Private
exports.deleteMeal = asyncHandler(async (req, res, next) => {
  const meal = await Meal.findById(req.params.id);

  if (!meal) {
    return res.status(404).json({
      success: false,
      message: 'Meal not found',
    });
  }

  // Make sure user owns the meal
  if (meal.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to delete this meal',
    });
  }

  await meal.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});