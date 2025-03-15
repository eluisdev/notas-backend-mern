import { createRequest, createResponse } from "node-mocks-http";
import { AuthController } from "../../controllers/AuthController";
import User from "../../models/User";
import { checkPassword, hashPassword } from "../../utils/auth";
import { generateJWT } from "../../utils/jwt";

jest.mock("../../models/User");
jest.mock("../../utils/auth");
jest.mock("../../utils/jwt");

describe("AuthController.createAccount", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it("should return a 409 status an error message if the email is already registered", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(true);
    const req = createRequest({
      method: "POST",
      url: "/api/auth/create-account",
      body: {
        password: "passwordExample",
        email: "example@example.com",
      },
    });
    const res = createResponse();
    await AuthController.createAccount(req, res);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(409);
    expect(data).toHaveProperty("error", "El Usuario ya esta registrado");
    expect(User.findOne).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalledTimes(1);
  });
  it("should return a 500 status", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/auth/create-account",
      body: {
        password: "passwordExample",
        email: "example@example.com",
      },
    });
    const res = createResponse();
    await AuthController.createAccount(req, res);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(500);
    expect(data).toHaveProperty("error", "Hubo un error");
  });
  it("should register a new user and return a success message", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(false);
    const req = createRequest({
      method: "POST",
      url: "/api/auth/create-account",
      body: {
        password: "passwordExample",
        email: "example@example.com",
        name: "Test User",
      },
    });
    const res = createResponse();
    const mockUser = {
      ...req.body,
      _id: "user123",
      save: jest.fn().mockResolvedValue(true),
    };
    const MockUser = User as jest.MockedClass<typeof User>;
    MockUser.mockImplementation(() => mockUser);
    (hashPassword as jest.Mock).mockResolvedValue("hashedpassword");
    (generateJWT as jest.Mock).mockReturnValue("123456");
    await AuthController.createAccount(req, res);
    expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
    expect(hashPassword).toHaveBeenCalledWith(req.body.password);
    expect(mockUser.save).toHaveBeenCalled();
    expect(mockUser.password).toBe("hashedpassword");
    expect(res._getStatusCode()).toBe(200);
    const data = res._getData();
    expect(data).toEqual({
      message: "Cuenta creada correctamente",
      token: "123456",
    });
  });
});

describe("AuthController.login", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it("should return 404 status and return message about user not founded", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/auth/login",
      body: {
        email: "example@example.com",
        password: "passwordExample",
      },
    });
    const res = createResponse();
    await AuthController.login(req, res);
    expect(res.statusCode).toBe(404);
    const data = res._getJSONData();
    expect(data).toHaveProperty("error", "Usuario no encontrado");
  });
  it("should return 401 code and return message about password", async () => {
    (User.findOne as jest.Mock).mockResolvedValue({
      _id: "1",
      email: "example@example.com",
      name: "example",
      password: "passwordHassed",
    });
    (checkPassword as jest.Mock).mockResolvedValue(false);
    const req = createRequest({
      method: "POST",
      url: "/api/auth/login",
      body: {
        email: "example@example.com",
        password: "example",
      },
    });
    const res = createResponse();
    await AuthController.login(req, res);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(401);
    expect(data).toHaveProperty("error", "Password Incorrecto");
  });
  it("should be login and  return message about login", async () => {
    (User.findOne as jest.Mock).mockResolvedValue({
      _id: "1",
      email: "example@example.com",
      name: "example",
      password: "passwordHassed",
    });
    (checkPassword as jest.Mock).mockResolvedValue(true);
    (generateJWT as jest.Mock).mockReturnValue("123456");
    const req = createRequest({
      method: "POST",
      url: "/api/auth/login",
      body: {
        email: "example@example.com",
        password: "passwordExample",
      },
    });
    const res = createResponse();
    await AuthController.login(req, res);
    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data).toBe(123456);
  });
});

describe("AuthController.user", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it("should return a user", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/auth/user",
      user: {
        _id: "1",
        email: "example@example.com",
        name: "example",
      },
    });
    const res = createResponse();
    await AuthController.user(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual(req.user);
  });
});

describe("AuthController.updateProfile", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it("should return 409 code and error message about email", async () => {
    (User.findOne as jest.Mock).mockResolvedValue({
      id: "1",
      email: "example@example.com",
      name: "example",
      password: "passwordHassed",
    });
    const req = createRequest({
      method: "POST",
      url: "/api/auth/profile",
      body: {
        email: "example@example.com",
        name: "example",
      },
      user: {
        id: "2",
        email: "example@example.com",
        name: "example",
      },
    });
    const res = createResponse();
    await AuthController.updateProfile(req, res);
    expect(res._getStatusCode()).toBe(409);
    expect(res._getJSONData()).toHaveProperty(
      "error",
      "Ese email ya esta registrado"
    );
  });

  it("should upload user and return message", async () => {
    (User.findOne as jest.Mock).mockResolvedValue({
      id: "1",
      email: "example@example.com",
      name: "example",
      password: "passwordHassed",
    });
    const req = createRequest({
      method: "PUT",
      url: "/api/auth/profile",
      body: {
        email: "example@example2.com",
        name: "example2",
      },
      user: {
        id: "1",
        email: "example@example.com",
        name: "example",
        save: jest.fn(),
      },
    });
    const res = createResponse();
    await AuthController.updateProfile(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toBe("Perfil actualizado correctamente");
  });
});

describe("AuthController.updateCurrentUserPassword", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it("should return 401 code and error message about update password", async () => {
    (User.findById as jest.Mock).mockResolvedValue({
      id: "1",
      email: "example@example.com",
      name: "example",
      password: "passwordHassed",
      save: jest.fn()
    });
    (checkPassword as jest.Mock).mockResolvedValue(false);
    const req = createRequest({
      method: "POST",
      url: "/api/auth/update-password",
      body: {
        password: "passwordChange",
        current_password: "password",
      },
      user: {
        _id: "1",
        email: "example@example.com",
        name: "example",
      },
    });
    const res = createResponse();
    await AuthController.updateCurrentUserPassword(req, res);
    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toHaveProperty(
      "error",
      "El Password actual es incorrecto"
    );
  });
  it("should return 401 code and error message about update password", async () => {
    (User.findById as jest.Mock).mockResolvedValue({
      id: "1",
      email: "example@example.com",
      name: "example",
      password: "passwordHassed",
      save: jest.fn()
    });
    (checkPassword as jest.Mock).mockResolvedValue(true);
    (hashPassword as jest.Mock).mockResolvedValue("passwordHassed")
    const req = createRequest({
      method: "POST",
      url: "/api/auth/update-password",
      body: {
        password: "passwordChange",
        current_password: "password",
      },
      user: {
        _id: "1",
        email: "example@example.com",
        name: "example",
      },
    });
    const res = createResponse();
    await AuthController.updateCurrentUserPassword(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toBe('El Password se modificó correctamente');
  });
});
