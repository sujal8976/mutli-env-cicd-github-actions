import mongoose from 'mongoose';
import { Task } from '../../src/server';

describe('Task Model Unit Tests', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/taskmanager-test');
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Task.deleteMany({});
  });

  test('should create a task with valid data', async () => {
    const taskData = {
      title: 'Test Task',
      description: 'Test Description',
      status: 'pending',
      priority: 'high'
    };

    const task = new Task(taskData);
    const savedTask = await task.save();

    expect(savedTask._id).toBeDefined();
    expect(savedTask.title).toBe(taskData.title);
    expect(savedTask.description).toBe(taskData.description);
    expect(savedTask.status).toBe(taskData.status);
    expect(savedTask.priority).toBe(taskData.priority);
    expect(savedTask.createdAt).toBeDefined();
    expect(savedTask.updatedAt).toBeDefined();
  });

  test('should fail to create task without required title', async () => {
    const task = new Task({ description: 'No title' });
    let error;
    try {
      await task.save();
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  test('should use default values', async () => {
    const task = new Task({ title: 'Minimal Task' });
    const savedTask = await task.save();

    expect(savedTask.description).toBe('');
    expect(savedTask.status).toBe('pending');
    expect(savedTask.priority).toBe('medium');
  });

  test('should only accept valid status values', async () => {
    const task = new Task({ title: 'Test', status: 'invalid' });
    let error;
    try {
      await task.save();
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  test('should only accept valid priority values', async () => {
    const task = new Task({ title: 'Test', priority: 'invalid' });
    let error;
    try {
      await task.save();
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });
});