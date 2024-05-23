/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/**/*.test.ts"],
  verbose: true,
  forceExit: true,
  //clearMocks: true
  testTimeout: 20000, // Global timeout for tests
  moduleNameMapper: {
    // Adjust paths as necessary for your setup
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
