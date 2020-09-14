// eslint-disable-next-line functional/immutable-data
module.exports = {
  globals: {
    __PATH_PREFIX__: '',
  },
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss)$': 'identity-obj-proxy',
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/file-mock.js',
  },
  setupFiles: ['<rootDir>/loadershim.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['\\.cache', 'cypress', 'node_modules', 'public'],
  transform: {
    '^.+\\.[jt]sx?$': '<rootDir>/jest-preprocess.js',
  },
  transformIgnorePatterns: ['node_modules/(?!(gatsby)/)'],
};
