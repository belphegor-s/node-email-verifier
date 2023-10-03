module.exports = {
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    testEnvironment: 'node',
    testMatch: ['**/**/*.test.ts'],
    verbose: true,
    forceExit: true,
    clearMocks: true
};