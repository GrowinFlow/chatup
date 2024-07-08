// webpack.config.js

const path = require('path');

module.exports = {
  // Other webpack configurations...
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify"),
      "fs": false,  // or provide a suitable polyfill if needed
      "process": false,  // or provide a suitable polyfill if needed
    },
  },
};
