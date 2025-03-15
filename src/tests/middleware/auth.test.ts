import { createRequest, createResponse } from "node-mocks-http";
import jwt from "jsonwebtoken";
import User from "../../models/User";
import { authenticate } from "../../middleware/auth";
import type { NextFunction } from "express";

// Mock de las dependencias
jest.mock("jsonwebtoken");
jest.mock("../../models/User");

describe("authenticate Middleware", () => {
  let next: NextFunction;
  beforeEach(() => {
    jest.resetAllMocks();
    next = jest.fn();
  });

  it("should return a 401 error if a token is not provided", async () => {
    const req = createRequest({
      headers: {},
    });
    const res = createResponse();
    await authenticate(req, res, next);
    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toEqual({ error: "No Autorizado" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return a 500 error if the token is invalid", async () => {
    const req = createRequest({
      headers: {
        authorization: "Bearer invalidToken",
      },
    });
    const res = createResponse();
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Token inválido");
    });
    await authenticate(req, res, next);
    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ error: "Token No Válido" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return a 500 error if the user does not exist", async () => {
    const req = createRequest({
      headers: {
        authorization: "Bearer validToken",
      },
    });
    const res = createResponse();
    (jwt.verify as jest.Mock).mockReturnValue({ id: "userId" });
    (User.findById as jest.Mock).mockResolvedValue(null);
    await authenticate(req, res, next);
    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({ error: "Token No Válido" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should add the user to req.user and call next if the token and user are valid", async () => {
    const req = createRequest({
      headers: {
        authorization: "Bearer validToken",
      },
      user: {
        _id: "userId",
        name: "Test User",
        email: "test@example.com",
      },
    });
    const res = createResponse();
    (jwt.verify as jest.Mock).mockReturnValue({ id: "userId" });
    const mockUser = {
      _id: "userId",
      name: "Test User",
      email: "test@example.com",
    };
    (User.findById as jest.Mock).mockImplementation(()=>({
      select: jest.fn().mockResolvedValue(mockUser)
    }))
    await authenticate(req, res, next);
    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
    expect(res._getStatusCode()).not.toBe(401);
    expect(res._getStatusCode()).not.toBe(500);
  });
});
