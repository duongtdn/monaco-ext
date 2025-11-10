module.exports = {
	testMatch: ['**/__tests__/**/*.unit.test.js'],
	testEnvironment: "jsdom",
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	transform: {
		'^.+\\.js$': 'babel-jest'
	},
	transformIgnorePatterns: [
		'node_modules/(?!(onigasm|monaco-textmate|monaco-editor-textmate)/)'
	]
};
