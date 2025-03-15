import { Request, Response, NextFunction } from "express";
import httpMocks from "node-mocks-http";
import Task from "../../models/Task";
import {
  taskExists,
  taskBelongsToProject,
  hasAuthorization,
} from "../../middleware/task";

jest.mock("../../models/Task");

describe("taskExists middleware", () => {

  let req: httpMocks.MockRequest<Request>;
  let res: httpMocks.MockResponse<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should call next() if the task exists", async () => {
    const taskId = "1234567890abcdef12345678";
    const mockTask = {
      _id: taskId,
      name: "Test Task",
      project: "projectId123",
    };
    (Task.findById as jest.Mock).mockResolvedValue(mockTask);
    req.params = { taskId };
    await taskExists(req, res, next);
    expect(Task.findById).toHaveBeenCalledWith(taskId);
    expect(req.task).toEqual(mockTask);
    expect(next).toHaveBeenCalled();
  });

  it("should return a 404 error if the task does not exist", async () => {
    const taskId = "1234567890abcdef12345678";
    (Task.findById as jest.Mock).mockResolvedValue(null);
    req.params = { taskId };
    await taskExists(req, res, next);
    expect(Task.findById).toHaveBeenCalledWith(taskId);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: "Tarea no encontrada" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return a 500 error if there is an error in the database", async () => {
    const taskId = "1234567890abcdef12345678";
    (Task.findById as jest.Mock).mockRejectedValue(new Error("Database error"));
    req.params = { taskId };
    await taskExists(req, res, next);
    expect(Task.findById).toHaveBeenCalledWith(taskId);
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ error: "Hubo un error" });
    expect(next).not.toHaveBeenCalled();
  });
});

describe("taskBelongsToProject middleware", () => {

  let req: httpMocks.MockRequest<Request>;
  let res: httpMocks.MockResponse<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should call next() if the task belongs to the project", () => {
    req.task = { project: "projectId123" } as any;
    req.project = { id: "projectId123" } as any;
    taskBelongsToProject(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("should return a 400 error if the task does not belong to the project", () => {
    req.task = { project: "projectId123" } as any;
    req.project = { id: "projectId456" } as any;

    taskBelongsToProject(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ error: "Acción no válida" });
    expect(next).not.toHaveBeenCalled();
  });
});

describe("hasAuthorization middleware", () => {

  let req: httpMocks.MockRequest<Request>;
  let res: httpMocks.MockResponse<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should call next() if the user is the project manager", () => {
    req.user = { id: "userId123" } as any;
    req.project = { manager: "userId123" } as any;
    hasAuthorization(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("should return a 400 error if the user is not the project manager", () => {
    req.user = { id: "userId123" } as any;
    req.project = { manager: "userId456" } as any;
    hasAuthorization(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ error: "Acción no válida" });
    expect(next).not.toHaveBeenCalled();
  });
});
