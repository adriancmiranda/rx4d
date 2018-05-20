const { dependencies } = require('../../package.json');
const { keys } = Object;
require('@babel/register')({
  only: keys(dependencies).reduce((acc, dependency) => {
    acc.unshift(`./node_modules/${dependency}/{src,source}/**/*.js`);
    return acc;
  }, ['./rx.next.js', './index.next.js']),
});
