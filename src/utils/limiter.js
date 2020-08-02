const Bottleneck = require('bottleneck/es5');
const got = require('got');

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 500,
});

exports.gotJsonLimited = async (url, options) =>
  limiter.schedule(() => got(url, options).json());
