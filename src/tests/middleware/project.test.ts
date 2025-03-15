import { Request, Response, NextFunction } from "express";
import httpMocks from "node-mocks-http";
import Project from "../../models/Project";
import { projectExists } from "../../middleware/project";

jest.mock("../../models/Project");

describe("projectExists middleware", () => {
  let req: httpMocks.MockRequest<Request>;
  let res: httpMocks.MockResponse<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("must call next() if the project exists", async () => {
    const projectId = "1234567890abcdef12345678";
    const mockProject = { _id: projectId, name: "Test Project" };
    (Project.findById as jest.Mock).mockResolvedValue(mockProject);
    req.params = { projectId };
    await projectExists(req, res, next);
    expect(Project.findById).toHaveBeenCalledWith(projectId);
    expect(req.project).toEqual(mockProject);
    expect(next).toHaveBeenCalled();
  });

  it("should return a 404 error if the project does not exist", async () => {
    const projectId = "1234567890abcdef12345678";
    (Project.findById as jest.Mock).mockResolvedValue(null);
    req.params = { projectId };
    await projectExists(req, res, next);
    expect(Project.findById).toHaveBeenCalledWith(projectId);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: "Proyecto no encontrado" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return a 500 error if there is an error in the database", async () => {
    const projectId = "1234567890abcdef12345678";
    (Project.findById as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );
    req.params = { projectId };
    await projectExists(req, res, next);
    expect(Project.findById).toHaveBeenCalledWith(projectId);
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ error: "Hubo un error" });
    expect(next).not.toHaveBeenCalled();
  });
});
