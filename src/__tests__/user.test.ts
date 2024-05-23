import request from "supertest";
import app from "../app";
import User from "../models/user.model";
import * as bcrypt from "bcrypt";
import * as tokenUtils from "../utils/jwt";

// Mock User model
jest.mock("../models/user.model");

// Mock bcrypt
jest.mock("bcrypt");

// Mock jwt
jest.mock("../utils/jwt");

describe("POST /api/v1/auth/login", () => {
  const mockUser = {
    _id: "12345",
    email: "test@example.com",
    password: "hashedpassword",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (User.findOne as jest.Mock).mockReset();
    (bcrypt.compare as jest.Mock).mockReset();
    (tokenUtils.signJwt as jest.Mock).mockReset();
    (tokenUtils.signRefreshToken as jest.Mock).mockReset();
  });

  it("should login successfully with valid credentials", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (tokenUtils.signJwt as jest.Mock).mockReturnValue("token");
    (tokenUtils.signRefreshToken as jest.Mock).mockReturnValue("refreshToken");

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com", password: "password" })
      .expect(200);

    expect(response.body).toEqual({
      message: "User logged in successfully",
      token: "token",
      refreshToken: "refreshToken",
    });

    expect(response.headers["set-cookie"]).toBeDefined();
  });

  it("should return 401 for invalid email", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "invalid@example.com", password: "password" })
      .expect(401);

    expect(response.body).toEqual({ message: "Invalid email or password" });
  }, 10000); // Increase timeout for this test

  it("should return 401 for invalid password", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com", password: "wrongpassword" })
      .expect(401);

    expect(response.body).toEqual({ message: "Invalid email or password" });
  }, 10000); // Increase timeout for this test

  it("should return 500 for internal server error", async () => {
    (User.findOne as jest.Mock).mockImplementation(() => {
      throw new Error("DB Error");
    });

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com", password: "password" })
      .expect(500);

    expect(response.body).toEqual({ message: "Internal server error" });
  }, 10000); // Increase timeout for this test
});
