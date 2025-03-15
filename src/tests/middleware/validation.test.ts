import { Request, Response, NextFunction } from "express";
import httpMocks from "node-mocks-http";
import { Result, ValidationError, validationResult } from "express-validator";
import { handleInputErrors } from "../../middleware/validation";

jest.mock("express-validator");

describe("handleInputErrors middleware", () => {
  let req: httpMocks.MockRequest<Request>;
  let res: httpMocks.MockResponse<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it("should call next() if there are no validation errors", () => {
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });
    handleInputErrors(req, res, next);
    expect(validationResult).toHaveBeenCalledWith(req);
    expect(next).toHaveBeenCalled();
    expect(res.statusCode).not.toBe(400);
  });

  it("should call next() if there are no validation errors", () => {
    const mockErrors = [
      { msg: "Campo requerido", param: "name" },
      { msg: "Correo inválido", param: "email" },
    ];
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => false,
      array: () => mockErrors,
    });
    handleInputErrors(req, res, next);
    expect(validationResult).toHaveBeenCalledWith(req);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ errors: mockErrors });
    expect(next).not.toHaveBeenCalled();
  });
});
