import EducationalResource from '../models/EducationalResource.js';
import UserProgress from '../models/UserProgress.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Get all educational resources
// @route   GET /api/education/resources
// @access  Public (or Private)
export const getResources = asyncHandler(async (req, res) => {
  const {
    type,
    category,
    level,
    page = 1,
    limit = 20,
    search,
    sortBy = 'order'
  } = req.query;

  const query = { isPublished: true };

  if (type) query.type = type;
  if (category) query.category = category;
  if (level) query.level = level;
  if (search) {
    query.$or = [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  const sortOptions = {};
  sortOptions[sortBy] = 1;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const resources = await EducationalResource.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit))
    .populate('prerequisites', 'title type level')
    .populate('relatedResources', 'title type level thumbnail');

  const total = await EducationalResource.countDocuments(query);

  res.json({
    success: true,
    resources,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

// @desc    Get single resource
// @route   GET /api/education/resources/:id
// @access  Public (or Private)
export const getResource = asyncHandler(async (req, res) => {
  const resource = await EducationalResource.findById(req.params.id)
    .populate('prerequisites', 'title type level')
    .populate('relatedResources', 'title type level thumbnail');

  if (!resource || !resource.isPublished) {
    return res.status(404).json({
      success: false,
      message: 'Resource not found'
    });
  }

  // Increment views
  resource.views += 1;
  await resource.save();

  res.json({
    success: true,
    resource
  });
});

// @desc    Get user progress for a resource
// @route   GET /api/education/resources/:id/progress
// @access  Private
export const getResourceProgress = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const resourceId = req.params.id;

  let progress = await UserProgress.findOne({
    user: userId,
    resource: resourceId
  });

  if (!progress) {
    progress = await UserProgress.create({
      user: userId,
      resource: resourceId,
      status: 'Not Started',
      progress: 0
    });
  }

  res.json({
    success: true,
    progress
  });
});

// @desc    Update user progress
// @route   PUT /api/education/resources/:id/progress
// @access  Private
export const updateProgress = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const resourceId = req.params.id;
  const { progress, status, timeSpent, notes, rating } = req.body;

  let userProgress = await UserProgress.findOne({
    user: userId,
    resource: resourceId
  });

  if (!userProgress) {
    userProgress = await UserProgress.create({
      user: userId,
      resource: resourceId,
      status: status || 'In Progress',
      progress: progress || 0,
      startedAt: new Date()
    });
  } else {
    if (progress !== undefined) userProgress.progress = Math.min(100, Math.max(0, progress));
    if (status !== undefined) userProgress.status = status;
    if (timeSpent !== undefined) userProgress.timeSpent += timeSpent;
    if (notes !== undefined) userProgress.notes = notes;
    if (rating !== undefined) userProgress.rating = rating;

    if (status === 'In Progress' && !userProgress.startedAt) {
      userProgress.startedAt = new Date();
    }
    if (status === 'Completed' && !userProgress.completedAt) {
      userProgress.completedAt = new Date();
    }
  }

  await userProgress.save();

  res.json({
    success: true,
    progress: userProgress
  });
});

// @desc    Submit quiz answer
// @route   POST /api/education/resources/:id/quiz
// @access  Private
export const submitQuizAnswer = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const resourceId = req.params.id;
  const { questionId, answer, isCorrect } = req.body;

  if (!questionId || answer === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Question ID and answer are required'
    });
  }

  let userProgress = await UserProgress.findOne({
    user: userId,
    resource: resourceId
  });

  if (!userProgress) {
    userProgress = await UserProgress.create({
      user: userId,
      resource: resourceId,
      status: 'In Progress',
      progress: 0,
      quizResults: []
    });
  }

  userProgress.quizResults.push({
    questionId,
    answer,
    isCorrect: isCorrect !== undefined ? isCorrect : false,
    answeredAt: new Date()
  });

  await userProgress.save();

  res.json({
    success: true,
    progress: userProgress
  });
});

// @desc    Get user's learning progress
// @route   GET /api/education/progress
// @access  Private
export const getUserProgress = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { status, category, level } = req.query;

  const query = { user: userId };
  if (status) query.status = status;

  const progressList = await UserProgress.find(query)
    .populate({
      path: 'resource',
      match: { isPublished: true },
      select: 'title type category level thumbnail duration',
      populate: {
        path: 'prerequisites',
        select: 'title'
      }
    })
    .sort({ updatedAt: -1 });

  // Filter by category/level if specified
  let filtered = progressList.filter(p => p.resource);
  if (category) {
    filtered = filtered.filter(p => p.resource.category === category);
  }
  if (level) {
    filtered = filtered.filter(p => p.resource.level === level);
  }

  const stats = {
    total: filtered.length,
    completed: filtered.filter(p => p.status === 'Completed').length,
    inProgress: filtered.filter(p => p.status === 'In Progress').length,
    notStarted: filtered.filter(p => p.status === 'Not Started').length,
    totalTimeSpent: filtered.reduce((sum, p) => sum + (p.timeSpent || 0), 0),
    averageProgress: filtered.length > 0
      ? filtered.reduce((sum, p) => sum + p.progress, 0) / filtered.length
      : 0
  };

  res.json({
    success: true,
    progress: filtered,
    stats
  });
});

// @desc    Rate a resource
// @route   POST /api/education/resources/:id/rate
// @access  Private
export const rateResource = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const resourceId = req.params.id;
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be between 1 and 5'
    });
  }

  const resource = await EducationalResource.findById(resourceId);

  if (!resource) {
    return res.status(404).json({
      success: false,
      message: 'Resource not found'
    });
  }

  // Update user progress rating
  let userProgress = await UserProgress.findOne({
    user: userId,
    resource: resourceId
  });

  if (userProgress) {
    userProgress.rating = rating;
    await userProgress.save();
  }

  // Update resource average rating
  const allProgress = await UserProgress.find({
    resource: resourceId,
    rating: { $exists: true, $ne: null }
  });

  if (allProgress.length > 0) {
    const totalRating = allProgress.reduce((sum, p) => sum + (p.rating || 0), 0);
    resource.rating = {
      average: totalRating / allProgress.length,
      count: allProgress.length
    };
    await resource.save();
  }

  res.json({
    success: true,
    resource: {
      rating: resource.rating
    }
  });
});

