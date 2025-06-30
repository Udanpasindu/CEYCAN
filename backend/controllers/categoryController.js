const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc    Get all categories with product counts
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  // Get all categories
  const categories = await Category.find({}).sort({ name: 1 });

  // Get product count for each category
  const categoriesWithCounts = await Promise.all(categories.map(async (category) => {
    const count = await Product.countDocuments({ category: category._id });
    return {
      ...category.toObject(),
      products: count
    };
  }));
  
  res.json({
    success: true,
    data: categoriesWithCounts,
    message: 'Categories retrieved successfully'
  });
});

// @desc    Get single category by ID with product count
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  // Get product count
  const productCount = await Product.countDocuments({ category: category._id });
  
  const categoryWithCount = {
    ...category.toObject(),
    products: productCount
  };

  res.json({
    success: true,
    data: categoryWithCount,
    message: 'Category retrieved successfully'
  });
});

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, icon, image } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Category name is required');
  }

  // Check if category already exists
  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    res.status(400);
    throw new Error('Category with this name already exists');
  }

  const category = await Category.create({
    name,
    description: description || '', // Ensure description is never null
    icon: icon || 'ChefHat',        // Provide default icon
    image: image || '',             // Ensure image is never null
    status: 'active'
  });

  if (category) {
    // Add an explicit products count of 0 for new categories
    const categoryWithCount = {
      ...category.toObject(),
      products: 0
    };
    
    res.status(201).json({
      success: true,
      data: categoryWithCount,
      message: 'Category created successfully'
    });
  } else {
    res.status(400);
    throw new Error('Invalid category data');
  }
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const { name, description, icon, image, status } = req.body;

  // Only check for duplicate name if the name is being updated
  if (name && name !== category.name) {
    const categoryWithName = await Category.findOne({ name });
    if (categoryWithName) {
      res.status(400);
      throw new Error('Category with this name already exists');
    }
  }

  category.name = name || category.name;
  category.description = description !== undefined ? description : category.description;
  category.icon = icon || category.icon;
  category.image = image !== undefined ? image : category.image;
  category.status = status || category.status;

  const updatedCategory = await category.save();

  res.json({
    success: true,
    data: updatedCategory,
    message: 'Category updated successfully'
  });
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  // Check if category has products associated
  const productCount = await Product.countDocuments({ category: category._id });
  if (productCount > 0) {
    res.status(400);
    throw new Error('Cannot delete category with associated products. Remove or reassign products first.');
  }

  await category.deleteOne();

  res.json({
    success: true,
    message: 'Category removed'
  });
});

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
