import { createRequest, createResponse } from "node-mocks-http";
import { TaskController } from "../../controllers/TaskController";
import Task from "../../models/Task";
import { Document, Types } from "mongoose";
import { Projects } from "../mocks/Project";
import Tasks, { Task as MockTask } from "../mocks/Task";

jest.mock("../../models/Task");

describe("TaskController.createTask", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return a 500 status code and an error message", async () => {
    const saveMock = jest.spyOn(Task.prototype, "save");
    saveMock.mockRejectedValue(new Error("Error al guardar la tarea"));

    const req = createRequest({
      method: "POST",
      url: "/api/projects/:projectId/tasks",
      body: {
        name: "Task Name",
        description: "Task Description",
      },
      project: {
        id: new Types.ObjectId(),
        tasks: [],
        save: jest.fn(),
      },
    });
    const res = createResponse();

    await TaskController.createTask(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toHaveProperty("error", "Hubo un error");
  });

  it("should return a success message", async () => {
    const saveMock = jest.spyOn(Task.prototype, "save");
    saveMock.mockResolvedValue({});

    const req = createRequest({
      method: "POST",
      url: "/api/projects/:projectId/tasks",
      body: {
        name: "Task Name",
        description: "Task Description",
      },
      project: {
        id: new Types.ObjectId(),
        tasks: [],
        save: jest.fn(),
      },
    });
    const res = createResponse();

    await TaskController.createTask(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toBe("Tarea creada correctamente");
  });
});

describe("TaskController.getProjectTasks", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return a 500 status code and an error message", async () => {
    (Task.find as jest.Mock).mockReturnThis();
    (Task.find(this).populate as jest.Mock).mockRejectedValue(new Error());

    const req = createRequest({
      method: "GET",
      url: "/api/projects/:projectId/tasks",
      project: {
        id: new Types.ObjectId(),
      },
    });
    const res = createResponse();

    await TaskController.getProjectTasks(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toHaveProperty("error", "Hubo un error");
  });

  it("should return a list of tasks", async () => {
    (Task.find as jest.Mock).mockReturnThis();
    (Task.find(this).populate as jest.Mock).mockResolvedValue(Tasks[0]);
    const req = createRequest({
      method: "GET",
      url: "/api/projects/:projectId/tasks",
      project: {
        id: new Types.ObjectId("65f0c7c5d8e4b3d1f0b4e701"),
      },
    });
    const res = createResponse();
    await TaskController.getProjectTasks(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual(Tasks[0]);
  });
});

describe("TaskController.getTaskById", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return a 500 status code and an error message", async () => {
    (Task.findById as jest.Mock).mockImplementation(() => ({
      populate: jest.fn().mockImplementation(() => ({
        populate: jest.fn().mockRejectedValue(new Error("Error simulado")),
      })),
    }));
    const req = createRequest({
      method: "GET",
      url: "/api/projects/:projectId/tasks/:taskId",
      task: {
        id: new Types.ObjectId(),
      },
    });
    const res = createResponse();
    await TaskController.getTaskById(req, res);
    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toHaveProperty("error", "Hubo un error");
  });

  it("should return a task", async () => {
    (Task.findById as jest.Mock).mockImplementation(() => ({
      populate: jest.fn().mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue(Tasks[0]),
      })),
    }));

    const req = createRequest({
      method: "GET",
      url: "/api/projects/:projectId/tasks/:taskId",
      task: {
        id: new Types.ObjectId("65f0ca7ee4b3d1f0f1a2b101"),
      },
    });
    const res = createResponse();
    await TaskController.getTaskById(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual(Tasks[0]);
  });
});

describe("TaskController.updateTask", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return a 500 status code and an error message", async () => {
    const req = createRequest({
      method: "PUT",
      url: "/api/projects/:projectId/tasks/:taskId",
      body: {
        name: "Updated Task Name",
        description: "Updated Task Description",
      },
      task: {
        id: new Types.ObjectId(),
        name: "Task Name",
        description: "Task Description",
        save: jest.fn().mockRejectedValue(new Error()),
      },
    });
    const res = createResponse();

    await TaskController.updateTask(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toHaveProperty("error", "Hubo un error");
  });

  it("should return a success message", async () => {
    const saveMock = jest.spyOn(Task.prototype, "save");
    saveMock.mockResolvedValue({});
    const req = createRequest({
      method: "PUT",
      url: "/api/projects/:projectId/tasks/:taskId",
      body: {
        name: "Updated Task Name",
        description: "Updated Task Description",
      },
      task: {
        id: new Types.ObjectId(),
        name: "Task Name",
        description: "Task Description",
        save: jest.fn(),
      },
    });
    const res = createResponse();
    await TaskController.updateTask(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toBe("Tarea Actualizada Correctamente");
  });
});

describe("TaskController.deleteTask", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return a 500 status code and an error message", async () => {
    const req = createRequest({
      method: "DELETE",
      url: "/api/projects/:projectId/tasks/:taskId",
      task: {
        id: new Types.ObjectId(),
        deleteOne: jest.fn().mockRejectedValue(new Error()),
      },
      project: {
        tasks: [new Types.ObjectId()],
        save: jest.fn().mockRejectedValue(new Error()),
      },
    });
    const res = createResponse();
    await TaskController.deleteTask(req, res);
    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toHaveProperty("error", "Hubo un error");
  });

  it("should return a success message", async () => {
    const deleteMock = jest.spyOn(Task.prototype, "deleteOne");
    deleteMock.mockResolvedValue({});

    const req = createRequest({
      method: "DELETE",
      url: "/api/projects/:projectId/tasks/:taskId",
      task: {
        id: new Types.ObjectId(),
        deleteOne: jest.fn(),
      },
      project: {
        tasks: [new Types.ObjectId()],
        save: jest.fn(),
      },
    });
    const res = createResponse();

    await TaskController.deleteTask(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toBe("Tarea Eliminada Correctamente");
  });
});

describe("TaskController.updateStatus", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return a 500 status code and an error message", async () => {
    const req = createRequest({
      method: "PATCH",
      url: "/api/projects/:projectId/tasks/:taskId/status",
      body: {
        status: "completed",
      },
      task: {
        id: new Types.ObjectId(),
        status: "pending",
        completedBy: [],
        save: jest.fn().mockRejectedValue(new Error()),
      },
      user: {
        id: new Types.ObjectId(),
      },
    });
    const res = createResponse();
    await TaskController.updateStatus(req, res);
    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toHaveProperty("error", "Hubo un error");
  });

  it("should return a success message", async () => {
    const saveMock = jest.spyOn(Task.prototype, "save");
    saveMock.mockResolvedValue({});
    const req = createRequest({
      method: "PATCH",
      url: "/api/projects/:projectId/tasks/:taskId/status",
      body: {
        status: "completed",
      },
      task: {
        id: new Types.ObjectId(),
        status: "pending",
        completedBy: [],
        save: jest.fn(),
      },
      user: {
        id: new Types.ObjectId(),
      },
    });
    const res = createResponse();
    await TaskController.updateStatus(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toBe("Tarea Actualizada");
  });
});
