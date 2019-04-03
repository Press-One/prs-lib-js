module.exports = {
  'env': {
    'commonjs': true,
    'es6': true,
    'node': true,
    'mocha': true,
    'browser': true
  },
  'extends': 'standard',
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parserOptions': {
    'ecmaVersion': 2018
  },
  'rules': {
    "semi": [2, "always"]
  }
}