import supertest from "supertest";
import app from "../app";
/* import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose"; */

describe("user", () => {
  /*   beforeAll(async () => {
    const mongodServer = await MongoMemoryServer.create();
    await mongoose.connect(mongodServer.getUri());
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  }); */

  //testing the register route
  describe("register a new user route", () => {
    describe("given an email exists", () => {
      it("should return 401", async () => {
        const username = "username";
        const email = "email@example.com";
        const password = "password123";
        const passwordConfirmation = "password123";
        const company = {
          name: "company",
          professionalEmail: "company@company-name.com",
        };
        const response = await supertest(app)
          .post("/api/v1/auth/register")
          .send({
            username,
            email,
            password,
            passwordConfirmation,
            company,
          });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("This Email Already Exists");
      });
    });

    describe("when there are missing data", () => {
      it("should return 400", async () => {
        const username = "username";
        const email = "email@example.com";
        const password = "password123";
        const passwordConfirmation = "password123";
        const company = {
          name: "company",
          professionalEmail: "company@company-name.com",
        };
        const response = await supertest(app)
          .post("/api/v1/auth/register")
          .send({
            username,
            company,
          });
        expect(response.status).toBe(400);
      });
    });
    describe("when passing the right data", () => {
      it("should return 201 with a note to activate the account", async () => {
        const response = await supertest(app)
          .post("/api/v1/auth/register")
          .send({
            username: "username",
            email: `${Date.now().toString()}@example.example`,
            password: "password123",
            passwordConfirmation: "password123",
            company: {
              name: "company",
              professionalEmail: "company@company-name.com",
            },
          });
        expect(response.status).toBe(201);

        expect(response.body.message).toBe(
          "success , now please activate your email , 1h in your hands"
        );
      });
    });
  });

  //testing the login route
  describe("login route", () => {
    describe("when passing the right data", () => {
      it("should return 200", async () => {
        const response = await supertest(app).post("/api/v1/auth/login").send({
          email: "email@example.com",
          password: "password123",
        });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("User logged in successfully");
      }, 10000);
    });

    describe("when missing data in the request body ", () => {
      it("should return 400", async () => {
        const response = await supertest(app).post("/api/v1/auth/login").send({
          email: "email@example.com",
        });
        expect(response.status).toBe(400);
      });
    });

    describe("when sending invalid credentials", () => {
      it("should return 401", async () => {
        const response = await supertest(app).post("/api/v1/auth/login").send({
          email: "email@example.com",
          password: "12364tyghbj",
        });
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid email or password");
      });
    });
  });
});
