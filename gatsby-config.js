require('ts-node').register({
  // Set `transpileOnly` to true to avoid type errors at the first-time run
  // when the graphql codegen has never run.
  // (The chicken or the egg causality dilemma)
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs',
    target: 'es6',
  },
});

// eslint-disable-next-line functional/immutable-data
module.exports = require('./src/gatsby/gatsby-config');
