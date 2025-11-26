import request from "supertest";
import mongoose from "mongoose";
import app, { Task, connectDB } from "../../src/server";

describe("Task API Integration Tests", () => {
  beforeAll(async () => {
    await connectDB("mongodb://localhost:27017/taskmanager-test");
  });

  
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Task.deleteMany({});
  });

  describe('GET /api/tasks', () => {
    test('should return empty array when no tasks exist', async () => {
      const response = await request(app).get('/api/tasks');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    test('should return all tasks', async () => {
      // Create tasks with a delay to ensure different timestamps
      const task1 = await Task.create({ 
        title: 'Task 1', 
        status: 'pending', 
        priority: 'high' 
      });
      
      // Small delay to ensure different createdAt timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const task2 = await Task.create({ 
        title: 'Task 2', 
        status: 'completed', 
        priority: 'low' 
      });

      const response = await request(app).get('/api/tasks');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      
      // Verify both tasks are returned
      const titles = response.body.map((t: any) => t.title);
      expect(titles).toContain('Task 1');
      expect(titles).toContain('Task 2');
      
      // Most recent should be first (Task 2)
      expect(response.body[0].title).toBe('Task 2');
    });
  });

  describe("GET /api/tasks/:id", () => {
    test("should return a task by id", async () => {
      const task = await Task.create({
        title: "Test Task",
        description: "Test",
      });
      const response = await request(app).get(`/api/tasks/${task._id}`);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Test Task");
      expect(response.body.description).toBe("Test");
    });

    test("should return 404 for non-existent task", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/api/tasks/${fakeId}`);
      expect(response.status).toBe(404);
    });
  });

  describe("POST /api/tasks", () => {
    test("should create a new task", async () => {
      const taskData = {
        title: "New Task",
        description: "Task description",
        status: "in-progress",
        priority: "high",
      };

      const response = await request(app).post("/api/tasks").send(taskData);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(taskData.title);
      expect(response.body.description).toBe(taskData.description);
      expect(response.body._id).toBeDefined();

      const savedTask = await Task.findById(response.body._id);
      expect(savedTask).toBeTruthy();
    });

    test("should fail to create task without title", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .send({ description: "No title" });

      expect(response.status).toBe(400);
    });
  });

  describe("PUT /api/tasks/:id", () => {
    test("should update an existing task", async () => {
      const task = await Task.create({ title: "Original", status: "pending" });

      const updates = {
        title: "Updated",
        status: "completed",
        priority: "low",
      };

      const response = await request(app)
        .put(`/api/tasks/${task._id}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Updated");
      expect(response.body.status).toBe("completed");
      expect(response.body.priority).toBe("low");
    });

    test("should return 404 for non-existent task", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/tasks/${fakeId}`)
        .send({ title: "Updated" });

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    test("should delete a task", async () => {
      const task = await Task.create({ title: "To Delete" });

      const response = await request(app).delete(`/api/tasks/${task._id}`);
      expect(response.status).toBe(200);

      const deletedTask = await Task.findById(task._id);
      expect(deletedTask).toBeNull();
    });

    test("should return 404 for non-existent task", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).delete(`/api/tasks/${fakeId}`);
      expect(response.status).toBe(404);
    });
  });
});
