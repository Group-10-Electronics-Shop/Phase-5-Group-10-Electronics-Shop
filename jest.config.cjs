module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleFileExtensions: ["js", "jsx"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/my-app/src/$1",   // ✅ alias for src
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/tests/__mocks__/fileMock.js",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  }
};
