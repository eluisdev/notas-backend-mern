import { createRequest, createResponse } from "node-mocks-http";
import { TeamMemberController } from "../../controllers/TeamController";
import User from "../../models/User";
import Project from "../../models/Project";
import { ProjectTeam } from "../mocks/Team";

jest.mock("../../models/User");
jest.mock("../../models/Project");

describe("TeamController.findMemberByEmail", () => {
  // Pruebas para findMemberByEmail
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it("should return a 404 error if the user is not found", async () => {
    (User.findOne as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(null),
    }));
    const req = createRequest({
      method: "POST",
      url: "/api/projects/:projectId/team/find",
      body: {
        email: "nonexistent@example.com",
      },
    });
    const res = createResponse();
    await TeamMemberController.findMemberByEmail(req, res);
    expect(res._getStatusCode()).toBe(404);
    expect(res._getJSONData()).toHaveProperty("error", "Usuario No Encontrado");
  });

  it("should return the user if found", async () => {
    const mockUser = {
      id: "123",
      email: "test@example.com",
      name: "Test User",
    };
    (User.findOne as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(mockUser),
    }));

    const req = createRequest({
      method: "POST",
      url: "/api/projects/:projectId/team/find",
      body: {
        email: "test@example.com",
      },
    });
    const res = createResponse();
    await TeamMemberController.findMemberByEmail(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual(mockUser);
  });
});

describe("TeamController.getProjecTeam", () => {
  it("should return a 404 error if there is a problem searching for the project", async () => {
    (Project.findById as jest.Mock).mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue(null),
    }));

    const req = createRequest({
      method: "GET",
      url: "/api/projects/:projectId/team",
      project: {
        id: "project123",
      },
    });
    const res = createResponse();
    await TeamMemberController.getProjecTeam(req, res);
    expect(res._getStatusCode()).toBe(404);
    expect(res._getJSONData()).toHaveProperty(
      "error",
      "Projecto no encontrado"
    );
  });
  it("should return the project team", async () => {
    (Project.findById as jest.Mock).mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue(ProjectTeam),
    }));
    const req = createRequest({
      method: "GET",
      url: "/api/projects/:projectId/team",
      project: {
        id: "65f0c5e1a6e4b3d1f0a2b4c1",
      },
    });
    const res = createResponse();
    await TeamMemberController.getProjecTeam(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual(ProjectTeam.team);
  });
});

describe("TeamController.addMemberById", () => {
  it("should return a 404 error if the user is not found", async () => {
    (User.findById as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockReturnValue(null),
    }));
    const req = createRequest({
      method: "POST",
      url: "/api/projects/:projectId/team",
      body: {
        id: "nonexistent",
      },
      project: {
        id: ProjectTeam._id,
        team: [],
        save: jest.fn(),
      },
    });
    const res = createResponse();
    await TeamMemberController.addMemberById(req, res);
    expect(res._getStatusCode()).toBe(404);
    expect(res._getJSONData()).toHaveProperty("error", "Usuario No Encontrado");
  });

  it("should return a 409 error if the user is already on the computer", async () => {
    const mockUser = {
      id: ProjectTeam.team[0]._id,
    };
    (User.findById as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(mockUser),
    }));

    const req = createRequest({
      method: "POST",
      url: "/api/projects/:projectId/team",
      body: {
        id: ProjectTeam.team[0]._id,
      },
      project: {
        id: ProjectTeam._id,
        team: [ProjectTeam.team[0]._id],
        save: jest.fn(),
      },
    });
    const res = createResponse();
    await TeamMemberController.addMemberById(req, res);
    expect(res._getStatusCode()).toBe(409);
    expect(res._getJSONData()).toHaveProperty(
      "error",
      "El usuario ya existe en el proyecto"
    );
  });

  it("should add the user to the team and return a success message", async () => {
    const mockUser = {
      id: "123",
    };
    (User.findById as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(mockUser),
    }));

    const req = createRequest({
      method: "POST",
      url: "/api/projects/:projectId/team",
      body: {
        id: "123",
      },
      project: {
        id: ProjectTeam._id,
        team: ["65f0c8e6d8e4b3d1f0b5e800"],
        save: jest.fn().mockResolvedValue({}),
      },
    });
    const res = createResponse();
    await TeamMemberController.addMemberById(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toBe("Usuario agregado correctamente");
  });
});

describe("TeamController.removeMemberById", () => {
  it("should return a 409 error if the user is not on the computer", async () => {
    const req = createRequest({
      method: "DELETE",
      url: "/api/projects/:projectId/team/:userId",
      params: {
        userId: "65f0c8e6d8e4b3d1f0b5e808",
      },
      project: {
        id: "project123",
        team: ProjectTeam.team,
        save: jest.fn(),
      },
    });
    const res = createResponse();
    await TeamMemberController.removeMemberById(req, res);
    expect(res._getStatusCode()).toBe(409);
    expect(res._getJSONData()).toHaveProperty(
      "error",
      "El usuario no existe en el proyecto"
    );
  });

  it("should remove the user from the computer and return a success message", async () => {
    const req = createRequest({
      method: "DELETE",
      url: "/api/projects/:projectId/team/:userId",
      params: {
        userId: ProjectTeam.team[0]._id,
      },
      project: {
        id: ProjectTeam._id,
        team: ProjectTeam.team.map(team => team._id),
        save: jest.fn().mockResolvedValue({}),
      },
    });
    const res = createResponse();
    await TeamMemberController.removeMemberById(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toBe("Usuario eliminado correctamente");
  });
});
