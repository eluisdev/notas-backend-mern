import { createRequest, createResponse } from "node-mocks-http";
import { ProjectController } from "../../controllers/ProjectController";
import Project, { IProject } from "../../models/Project";
import { Document, Types } from "mongoose";
import { Projects } from "../mocks/Project";

jest.mock("../../models/Project");

describe("ProjectController.createProject", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it("should return a 500 status code an error message", async () => {
    const saveMock = jest.spyOn(Project.prototype, "save");
    saveMock.mockRejectedValue(new Error("Error al guardar el proyecto"));
    const req = createRequest({
      method: "POST",
      url: "/api/projects",
      body: {
        projectName: "projectName",
        clientName: "clientName",
        description: "description",
      },
      user: { id: "1" },
    });
    const res = createResponse();
    await ProjectController.createProject(req, res);
    const data = res._getJSONData();
    expect(res._getStatusCode()).toBe(500);
    expect(data).toHaveProperty("error", "Hubo un error");
  });
  it("should return a 200 status code and success message", async () => {
    (Project as jest.MockedClass<typeof Project>).mockImplementation(() => ({
      ...req.body,
      _id: new Types.ObjectId(),
      save: jest.fn(),
    }));
    const req = createRequest({
      method: "POST",
      url: "/api/auth/create-account",
      body: {
        projectName: "projectName",
        clientName: "clientName",
        description: "description",
      },
      user: { id: "1" },
    });
    const res = createResponse();
    await ProjectController.createProject(req, res);
    const data = res._getData();
    expect(res.statusCode).toBe(200);
    expect(data).toBe("Proyecto Creado Correctamente");
  });
});
//   beforeEach(() => {
//     jest.resetAllMocks();
//   });
//   it("should return 404 status and return message about user not founded", async () => {
//     const req = createRequest({
//       method: "POST",
//       url: "/api/auth/login",
//       body: {
//         email: "example@example.com",
//         password: "passwordExample",
//       },
//     });
//     const res = createResponse();
//     await ProjectController.login(req, res);
//     expect(res.statusCode).toBe(404);
//     const data = res._getJSONData();
//     expect(data).toHaveProperty("error", "Usuario no encontrado");
//   });
//   it("should return 401 code and return message about password", async () => {
//     (User.findOne as jest.Mock).mockResolvedValue({
//       _id: "1",
//       email: "example@example.com",
//       name: "example",
//       password: "passwordHassed",
//     });
//     (checkPassword as jest.Mock).mockResolvedValue(false);
//     const req = createRequest({
//       method: "POST",
//       url: "/api/auth/login",
//       body: {
//         email: "example@example.com",
//         password: "example",
//       },
//     });
//     const res = createResponse();
//     await ProjectController.login(req, res);
//     expect(res.statusCode).toBe(401);
//     const data = res._getJSONData();
//     expect(data).toHaveProperty("error", "Password Incorrecto");
//   });
//   it("should be login and  return message about login", async () => {
//     (User.findOne as jest.Mock).mockResolvedValue({
//       _id: "1",
//       email: "example@example.com",
//       name: "example",
//       password: "passwordHassed",
//     });
//     (checkPassword as jest.Mock).mockResolvedValue(true);
//     (generateJWT as jest.Mock).mockReturnValue("123456");
//     const req = createRequest({
//       method: "POST",
//       url: "/api/auth/login",
//       body: {
//         email: "example@example.com",
//         password: "passwordExample",
//       },
//     });
//     const res = createResponse();
//     await ProjectController.login(req, res);
//     expect(res.statusCode).toBe(200);
//     const data = res._getJSONData();
//     expect(data).toBe(123456);
//   });
// });

// describe("ProjectController.user", () => {
//   beforeEach(() => {
//     jest.resetAllMocks();
//   });
//   it("should return a user", async () => {
//     const req = createRequest({
//       method: "GET",
//       url: "/api/auth/user",
//       user: {
//         _id: "1",
//         email: "example@example.com",
//         name: "example",
//       },
//     });
//     const res = createResponse();
//     await ProjectController.user(req, res);
//     expect(res._getStatusCode()).toBe(200);
//     expect(res._getJSONData()).toEqual(req.user);
//   });
// });

// describe("ProjectController.updateProfile", () => {
//   beforeEach(() => {
//     jest.resetAllMocks();
//   });
//   it("should return 409 code and error message about email", async () => {
//     (User.findOne as jest.Mock).mockResolvedValue({
//       id: "1",
//       email: "example@example.com",
//       name: "example",
//       password: "passwordHassed",
//     });
//     const req = createRequest({
//       method: "POST",
//       url: "/api/auth/profile",
//       body: {
//         email: "example@example.com",
//         name: "example",
//       },
//       user: {
//         id: "2",
//         email: "example@example.com",
//         name: "example",
//       },
//     });
//     const res = createResponse();
//     await ProjectController.updateProfile(req, res);
//     expect(res._getStatusCode()).toBe(409);
//     expect(res._getJSONData()).toHaveProperty(
//       "error",
//       "Ese email ya esta registrado"
//     );
//   });

//   it("should upload user and return message", async () => {
//     (User.findOne as jest.Mock).mockResolvedValue({
//       id: "1",
//       email: "example@example.com",
//       name: "example",
//       password: "passwordHassed",
//     });
//     const req = createRequest({
//       method: "PUT",
//       url: "/api/auth/profile",
//       body: {
//         email: "example@example2.com",
//         name: "example2",
//       },
//       user: {
//         id: "1",
//         email: "example@example.com",
//         name: "example",
//         save: jest.fn(),
//       },
//     });
//     const res = createResponse();
//     await ProjectController.updateProfile(req, res);
//     expect(res._getStatusCode()).toBe(200);
//     expect(res._getData()).toBe("Perfil actualizado correctamente");
//   });
// });

// describe("ProjectController.updateCurrentUserPassword", () => {
//   beforeEach(() => {
//     jest.resetAllMocks();
//   });
//   it("should return 401 code and error message about update password", async () => {
//     (User.findById as jest.Mock).mockResolvedValue({
//       id: "1",
//       email: "example@example.com",
//       name: "example",
//       password: "passwordHassed",
//       save: jest.fn()
//     });
//     (checkPassword as jest.Mock).mockResolvedValue(false);
//     const req = createRequest({
//       method: "POST",
//       url: "/api/auth/update-password",
//       body: {
//         password: "passwordChange",
//         current_password: "password",
//       },
//       user: {
//         _id: "1",
//         email: "example@example.com",
//         name: "example",
//       },
//     });
//     const res = createResponse();
//     await ProjectController.updateCurrentUserPassword(req, res);
//     expect(res._getStatusCode()).toBe(401);
//     expect(res._getJSONData()).toHaveProperty(
//       "error",
//       "El Password actual es incorrecto"
//     );
//   });
//   it("should return 401 code and error message about update password", async () => {
//     (User.findById as jest.Mock).mockResolvedValue({
//       id: "1",
//       email: "example@example.com",
//       name: "example",
//       password: "passwordHassed",
//       save: jest.fn()
//     });
//     (checkPassword as jest.Mock).mockResolvedValue(true);
//     (hashPassword as jest.Mock).mockResolvedValue("passwordHassed")
//     const req = createRequest({
//       method: "POST",
//       url: "/api/auth/update-password",
//       body: {
//         password: "passwordChange",
//         current_password: "password",
//       },
//       user: {
//         _id: "1",
//         email: "example@example.com",
//         name: "example",
//       },
//     });
//     const res = createResponse();
//     await ProjectController.updateCurrentUserPassword(req, res);
//     expect(res._getStatusCode()).toBe(200);
//     expect(res._getData()).toBe('El Password se modificó correctamente');
//   });
// });

describe("ProjectController.createProject", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it("should return a 500 status code an error message", async () => {
    const saveMock = jest.spyOn(Project.prototype, "save");
    saveMock.mockRejectedValue(new Error("Error al guardar el proyecto"));
    const req = createRequest({
      method: "POST",
      url: "/api/projects",
      body: {
        projectName: "projectName",
        clientName: "clientName",
        description: "description",
      },
      user: { id: "1" },
    });
    const res = createResponse();
    await ProjectController.createProject(req, res);
    const data = res._getJSONData();
    expect(res._getStatusCode()).toBe(500);
    expect(data).toHaveProperty("error", "Hubo un error");
  });
  it("should return a 200 status code and success message", async () => {
    (Project as jest.MockedClass<typeof Project>).mockImplementation(() => ({
      ...req.body,
      _id: new Types.ObjectId(),
      save: jest.fn(),
    }));
    const req = createRequest({
      method: "POST",
      url: "/api/auth/create-account",
      body: {
        projectName: "projectName",
        clientName: "clientName",
        description: "description",
      },
      user: { id: "1" },
    });
    const res = createResponse();
    await ProjectController.createProject(req, res);
    const data = res._getData();
    expect(res.statusCode).toBe(200);
    expect(data).toBe("Proyecto Creado Correctamente");
  });
});

describe("ProjectController.getAllProjects", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it("should return a 500 status code an error message", async () => {
    (Project.find as jest.Mock).mockRejectedValue(new Error());
    Project.find as jest.Mock;
    const req = createRequest({
      method: "GET",
      url: "/api/projects",
      user: { id: "1" },
    });
    const res = createResponse();
    await ProjectController.getAllProjects(req, res);
    const data = res._getJSONData();
    expect(res._getStatusCode()).toBe(500);
    expect(data).toHaveProperty("error", "Hubo un error");
  });
  it("should return a 200 status code and success message", async () => {
    (Project.find as jest.Mock).mockResolvedValue(Projects);
    const req = createRequest({
      method: "GET",
      url: "/api/projects",
      user: { id: "1" },
    });
    const res = createResponse();
    await ProjectController.getAllProjects(req, res);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data).toEqual(Projects);
  });
});

describe("ProjectController.getProjectById", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it("should return a 404 status code and error message about not founded proyect", async () => {
    (Project.findById as jest.Mock).mockReturnThis();
    (Project.findById(this).populate as jest.Mock).mockResolvedValue(null);
    const req = createRequest({
      method: "GET",
      url: "/api/projects/:id",
      params: { id: "1" },
      user: { id: "1" },
    });
    const res = createResponse();
    await ProjectController.getProjectById(req, res);
    const data = res._getJSONData();
    expect(res._getStatusCode()).toBe(404);
    expect(data).toHaveProperty("error", "Proyecto no encontrado");
  });
  it("should return a 404 status code and an error message when the user is not the owner of the project", async () => {
    (Project.findById as jest.Mock).mockReturnThis();
    (Project.findById(this).populate as jest.Mock).mockResolvedValue(
      Projects[0]
    );
    const req = createRequest({
      method: "GET",
      url: "/api/projects/:id",
      params: { id: "65f0c5e1a6e4b3d1f0a2b4c1" },
      user: { id: new Types.ObjectId() },
    });
    const res = createResponse();
    await ProjectController.getProjectById(req, res);
    const data = res._getJSONData();
    expect(res._getStatusCode()).toBe(403);
    expect(data).toHaveProperty("error", "Acción no válida");
  });
  it("should return a 200 status code and return project", async () => {
    (Project.findById as jest.Mock).mockReturnThis();
    (Project.findById(this).populate as jest.Mock).mockResolvedValue(
      Projects[0]
    );
    const req = createRequest({
      method: "GET",
      url: "/api/projects/:id",
      params: { id: "65f0c5e1a6e4b3d1f0a2b4c1" },
      user: { id: "65f0c7c5d8e4b3d1f0b4e701" },
    });
    const res = createResponse();
    await ProjectController.getProjectById(req, res);
    const data = res._getJSONData();
    expect(res._getStatusCode()).toBe(200);
    expect(data).toEqual(Projects[0]);
  });
});

describe("ProjectController.updateProject", () => {
  it("should return a 500 status code and error message", async () => {
    const req = createRequest({
      method: "PUT",
      url: "/api/projects/:id",
      body: {
        clientName: "newClientName",
        projectName: "newProjectName",
        description: "newDescription",
      },
      project: {
        clientName: "beforeClientName",
        projectName: "beforeProjectName",
        description: "beforeDescription",
        save: jest.fn().mockRejectedValue(new Error()),
      },
    });
    const res = createResponse();
    await ProjectController.updateProject(req, res);
    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toHaveProperty("error", "Hubo un error");
  });
  it("should return a 200 status code and success message about update project", async () => {
    const req = createRequest({
      method: "PUT",
      url: "/api/projects/:id",
      body: {
        clientName: "newClientName",
        projectName: "newProjectName",
        description: "newDescription",
      },
      project: {
        clientName: "beforeClientName",
        projectName: "beforeProjectName",
        description: "beforeDescription",
        save: jest.fn(),
      },
    });
    const res = createResponse();
    await ProjectController.updateProject(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toBe("Proyecto Actualizado");
  });
});
describe("ProjectController.deleteProject", () => {
  it("should return a 500 status code and error message", async () => {
    const req = createRequest({
      method: "DELETE",
      url: "/api/projects/:projectId",
      project: {
        deleteOne: jest.fn().mockRejectedValue(new Error()),
      },
    });
    const res = createResponse();
    await ProjectController.deleteProject(req, res);
    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toHaveProperty("error", "Hubo un error");
  });
  it("should return a 200 status code and success message about delete project", async () => {
    const req = createRequest({
      method: "DELETE",
      url: "/api/projects/:projectId",
      project: {
        deleteOne: jest.fn(),
      },
    });
    const res = createResponse();
    await ProjectController.deleteProject(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toBe("Proyecto Eliminado");
  });
});
