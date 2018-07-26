const gulp = require('gulp');
const eslint = require('gulp-eslint');
const jest = require('jest-cli');
const exec = require('child_process').exec;
const ts = require('gulp-typescript');
const tslint = require('gulp-tslint');
const typedoc = require('gulp-typedoc');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('deploy-contracts', (callback) => {
  exec('truffle deploy', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    callback(err);
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
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .js
    .pipe(sourcemaps.write(''))
    .pipe(gulp.dest('build'));
});

gulp.task('typedoc', function () {
  return gulp
    .src(['src/**/*.ts'])
    .pipe(typedoc(require('./typedoc.js')));
});

gulp.task('compile', ['tslint', 'tsc']);
gulp.task('test', ['tslint', 'jest']);
gulp.task('publish', ['tslint', 'jest', 'tsc', 'typedoc']);
