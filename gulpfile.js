const gulp = require('gulp');
const eslint = require('gulp-eslint');
const jest = require('jest-cli');

const jestConfig = {
  verbose: false,
  rootDir: '.'
};

gulp.task('lint', () => {
  return gulp.src(['**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('jest', (done) => {
  jest.runCLI({
    config: Object.assign(jestConfig, { testMatch: ['**/test/specs/*.js'] })
  }, '.', () => done());
});

gulp.task('js', ['lint', 'jest']);
