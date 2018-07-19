const gulp = require('gulp');
const eslint = require('gulp-eslint');
const jest = require('jest-cli');
const exec = require('child_process').exec;
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');

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

gulp.task('jest', () => {
  return jest.runCLI({}, '.');
});

gulp.task('tslint', () =>
  gulp.src('src/**/*.ts')
    .pipe(tslint({
      formatter: 'prose'
    })).pipe(tslint.report({
      emitError: false
    }))
);

gulp.task('tsc', function () {
  var tsProject = ts.createProject('tsconfig.json');
  return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest('build'));
});

gulp.task('compile', ['tslint', 'tsc']);
gulp.task('test', ['jest','compile']);
