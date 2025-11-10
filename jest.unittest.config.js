module.exports = {
	testMatch: ['**/__tests__/**/*.unit.test.js'],
	testEnvironment: "jsdom",
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
