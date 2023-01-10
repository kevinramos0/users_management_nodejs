const presets = [
  ['@babel/preset-env', {
    targets: {
      node: 'current',
    },
  }],
];

const plugins = [
  ['@babel/plugin-transform-runtime'],
];

module.exports = { presets, plugins };
