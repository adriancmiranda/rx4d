const { dependencies } = require('../../package.json');
require('@babel/polyfill');
require('@babel/register')({
  only: Object.keys(dependencies).reduce((acc, dependency) => {
    acc.unshift(`./node_modules/${dependency}/source/**/*.js`);
    return acc;
  }, ['./index.next.js']),
});
