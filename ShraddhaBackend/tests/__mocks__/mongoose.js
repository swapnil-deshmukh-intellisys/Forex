export default {
  connect: jest.fn().mockResolvedValue({}),
  connection: {
    close: jest.fn().mockResolvedValue({}),
    readyState: 1,
  },
  Schema: class Schema {
    constructor(definition) { this.definition = definition; }
    static Types = {
      ObjectId: jest.fn().mockImplementation((id) => id || 'mocked-object-id'),
    };
  },
  Types: {
    ObjectId: jest.fn().mockImplementation((id) => id || 'mocked-object-id'),
  },
  model: jest.fn().mockReturnValue({
    find: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    create: jest.fn().mockResolvedValue({}),
    updateOne: jest.fn().mockResolvedValue({}),
    deleteOne: jest.fn().mockResolvedValue({}),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([]),
  }),
};

export const connect = jest.fn().mockResolvedValue({});
export const connection = {
  close: jest.fn().mockResolvedValue({}),
  readyState: 1,
};
export const Schema = class Schema {
  constructor(definition) { this.definition = definition; }
};
Schema.Types = {
  ObjectId: jest.fn().mockImplementation((id) => id || 'mocked-object-id'),
};
export const Types = {
  ObjectId: jest.fn().mockImplementation((id) => id || 'mocked-object-id'),
};
export const model = jest.fn().mockReturnValue({
  find: jest.fn().mockReturnThis(),
  findOne: jest.fn().mockReturnThis(),
  findById: jest.fn().mockReturnThis(),
  create: jest.fn().mockResolvedValue({}),
  updateOne: jest.fn().mockResolvedValue({}),
  deleteOne: jest.fn().mockResolvedValue({}),
  sort: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([]),
});
