import { createRequest, createResponse } from "node-mocks-http";
import { NoteController } from "../../controllers/NoteController";
import { Task as mockTask } from "../mocks/Task";
import { Note as mockNote } from "../mocks/Note";
import Note from "../../models/Note";
import { Types } from "mongoose";
import type { Request } from "express";

jest.mock("../../models/Note");
jest.mock("../../models/Task");

describe("NoteController.createNote", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it("should return 500 code and error message", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/projects/:projectId/tasks/:taskId/notes",
      body: {},
      user: {
        id: "1",
        name: "example",
        email: "example@example.com",
      },
      task: {
        ...JSON.parse(JSON.stringify(mockTask)),
        save: jest.fn().mockRejectedValue(new Error()),
      },
    });
    const res = createResponse();
    Note.prototype.save = jest.fn().mockRejectedValue(new Error("Save failed"));
    await NoteController.createNote(req, res);
    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toHaveProperty("error", "Hubo un error");
  });
  it("should create a note and return success message", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/projects/:projectId/tasks/:taskId/notes",
      body: {},
      user: {
        id: "1",
        name: "example",
        email: "example@example.com",
      },
      task: {
        ...JSON.parse(JSON.stringify(mockTask)),
        save: jest.fn(),
      },
    });
    const res = createResponse();
    Note.prototype.save = jest.fn().mockResolvedValue(true);
    await NoteController.createNote(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toBe("Nota Creada Correctamente");
  });
});

describe("NoteController.getTaskNotes", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it("should return 500 code and message error", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/projects/:projectId/tasks/:taskId/notes",
      task: {},
    });
    const res = createResponse({});
    (Note.find as jest.Mock).mockRejectedValue(new Error("Hubo un error"));
    await NoteController.getTaskNotes(req, res);
    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toHaveProperty("error", "Hubo un error");
  });
  it("should obtain a task", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/projects/:projectId/tasks/:taskId/notes",
      task: { id: "1" },
    });
    const res = createResponse({});
    await NoteController.getTaskNotes(req, res);
    expect(Note.find).toHaveBeenCalledWith({ task: req.task.id });
    expect(res._getStatusCode()).toBe(200);
  });
});

describe("NoteController.deleteNote", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it("should return a 404 code and message about not founded", async () => {
    (Note.findById as jest.Mock).mockResolvedValue(null);
    const req = createRequest<Request<{ noteId: Types.ObjectId }>>({
      method: "DELETE",
      url: "/api/projects/:projectId/tasks/:taskId/notes/:noteId",
      params: { noteId: new Types.ObjectId() },
    });
    const res = createResponse();
    await NoteController.deleteNote(req, res);
    expect(res._getStatusCode()).toBe(404);
    expect(res._getJSONData()).toHaveProperty("error", "Nota no encontrada");
  });
  it("should return a 401 code and message about action invalidate", async () => {
    (Note.findById as jest.Mock).mockResolvedValue(mockNote);
    const req = createRequest<Request<{ noteId: Types.ObjectId }>>({
      method: "DELETE",
      url: "/api/projects/:projectId/tasks/:taskId/notes/:noteId",
      params: { noteId: new Types.ObjectId() },
      user: { id: new Types.ObjectId() },
    });
    const res = createResponse();
    await NoteController.deleteNote(req, res);
    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toHaveProperty("error", "Acción no válida");
  });
  it("should return a 200 code and message about delete note", async () => {
    (Note.findById as jest.Mock).mockResolvedValue(mockNote);
    const req = createRequest<Request<{ noteId: Types.ObjectId }>>({
      method: "DELETE",
      url: "/api/projects/:projectId/tasks/:taskId/notes/:noteId",
      params: { noteId: "1" },
      user: { id: "60c72b2f5f1b2c001fbb02f4" },
      task: {
        ...mockTask,
        save: jest.fn(),
      },
    });
    const res = createResponse();
    await NoteController.deleteNote(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toBe("Nota Eliminada");
  });
});
