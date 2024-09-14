import asyncHandler from "../middleware/asyncHandler.js";
import Todo from "../models/todoModel.js";

// @desc    Fetch all todo items
// @route   GET /api/items
// @access  Public
const getTodoItems = asyncHandler(async (req, res) => {
  const items = await Todo.find({});

  res.json({ items });
});

// @desc    Fetch single todo item
// @route   GET /api/items/:id
// @access  Public
const getTodoById = asyncHandler(async (req, res) => {
  const item = await Todo.findById(req.params.id);
  if (item) {
    return res.json(item);
  }
  res.status(404);
  throw new Error("Resource not found");
});

// @desc    Create a new todo item
// @route   POST /api/items
// @access  Private/Admin
const createNewTodo = asyncHandler(async (req, res) => {
  const { title, description, status } = req.body;

  const item = new Todo({
    user: req.user._id,
    title,
    description,
    status,
  });

  const createdItem = await item.save();

  res.status(201).json(createdItem);
});

// @desc    Update a todo item
// @route   PUT /api/items/:id
// @access  Private/Admin
const updateTodo = asyncHandler(async (req, res) => {
  const { title, description, status } = req.body;

  const item = await Todo.findById(req.params.id);

  if (item) {
    item.title = title;
    item.description = description;
    item.status = status;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } else {
    res.status(404);
    throw new Error("Todo Item not found");
  }
});

// @desc    Delete a todo item
// @route   DELETE /api/items/:id
// @access  Private/Admin
const deleteTodo = asyncHandler(async (req, res) => {
  const item = await Todo.findById(req.params.id);

  if (item) {
    await Todo.deleteOne({ _id: item._id });
    res.json({ message: "Todo item removed" });
  } else {
    res.status(404);
    throw new Error("Todo item not found");
  }
});

export { getTodoItems, getTodoById, createNewTodo, updateTodo, deleteTodo };
