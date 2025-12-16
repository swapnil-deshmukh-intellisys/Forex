import mongoose from 'mongoose';

/**
 * Database helper functions for testing
 */

/**
 * Connect to test database
 */
export const connectTestDB = async () => {
  const testDbUrl = process.env.TEST_DATABASE_URL || 'mongodb://localhost:27017/forex_test';
  
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(testDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  
  return mongoose.connection;
};

/**
 * Disconnect from test database
 */
export const disconnectTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
};

/**
 * Drop test database
 */
export const dropTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.db.dropDatabase();
  }
};

/**
 * Clean all collections in test database
 */
export const cleanTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
};

/**
 * Clean specific collections
 */
export const cleanCollections = async (collectionNames) => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    
    for (const name of collectionNames) {
      if (collections[name]) {
        await collections[name].deleteMany({});
      }
    }
  }
};

/**
 * Get collection count
 */
export const getCollectionCount = async (collectionName) => {
  if (mongoose.connection.readyState !== 0) {
    const collection = mongoose.connection.collections[collectionName];
    if (collection) {
      return await collection.countDocuments();
    }
  }
  return 0;
};

/**
 * Check if collection exists
 */
export const collectionExists = async (collectionName) => {
  if (mongoose.connection.readyState !== 0) {
    const collections = await mongoose.connection.db.listCollections().toArray();
    return collections.some(col => col.name === collectionName);
  }
  return false;
};

/**
 * Create index on collection
 */
export const createIndex = async (collectionName, index, options = {}) => {
  if (mongoose.connection.readyState !== 0) {
    const collection = mongoose.connection.collections[collectionName];
    if (collection) {
      await collection.createIndex(index, options);
    }
  }
};

/**
 * Drop index from collection
 */
export const dropIndex = async (collectionName, indexName) => {
  if (mongoose.connection.readyState !== 0) {
    const collection = mongoose.connection.collections[collectionName];
    if (collection) {
      await collection.dropIndex(indexName);
    }
  }
};

