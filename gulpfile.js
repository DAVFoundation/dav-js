const gulp = require('gulp');
const eslint = require('gulp-eslint');
const jest = require('jest-cli');
const exec = require('child_process').exec;

// const ganache = require('ganache-cli');

// const server = ganache.server();
// server.listen(8545, () => {
//   console.log(
//     `Local Ethereum testnet started on http://localhost:${port}`
//   );
//   exec('truffle deploy', function (err, stdout, stderr) {
//     console.log(stdout);
//     console.log(stderr);
//     console.log(err);
//   });
// });

const jestConfig = {
  verbose: false,
  rootDir: '.'
};

gulp.task('deploy-contracts', (calback) => {
  exec('truffle deploy', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    calback(err);
  });
});

gulp.task('lint', () => {
  return gulp.src(['**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('jest', (done) => {
  jest.runCLI({
    config: Object.assign(jestConfig, { testMatch: ['**/test/specs/*.js'] })
  }, '.')
    .then(({ results }) => {
      if (results.numFailedTests || results.numFailedTestSuites) {
        done('Tests Failed');
      }
      else {
        done();
      }
    });

});

gulp.task('js', ['lint', 'jest']);
