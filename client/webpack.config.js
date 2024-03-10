const nodeExternals = require('webpack-node-externals');

module.exports = {
  // Your webpack configuration options...
  target: 'web', // Make sure to set the target to 'web' for browser environment
  externalsPresets: { node: true }, // Enable node externals presets
  externals: [nodeExternals()], // Use the webpack-node-externals plugin
  // Other configuration options...
};
