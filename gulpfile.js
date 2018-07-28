const gulp = require('gulp');
const eslint = require('gulp-eslint');
const jest = require('gulp-jest').default;
const exec = require('child_process').exec;
const ts = require('gulp-typescript');
const tslint = require('gulp-tslint');
const typedoc = require('gulp-typedoc');
const sourcemaps = require('gulp-sourcemaps');

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

gulp.task('jest', (done) => {
  return gulp.src('')
    .on('error', function (err) { done(err); })
    .pipe(jest({}));
});

gulp.task('tslint', (done) => {
  return gulp.src('src/**/*.ts')
    .on('error', function (err) { done(err); })
    .pipe(tslint({ formatter: 'prose' }))
    .pipe(tslint.report());
});

gulp.task('tsc', function (done) {
  var tsProject = ts.createProject('tsconfig.json');
  return tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .on('error', function (err) { done(err); })
    .js
    .pipe(sourcemaps.write(''))
    .pipe(gulp.dest('build'));
});

gulp.task('typedoc', function (done) {
  return gulp
    .src(['src/**/*.ts'])
    .on('error', function (err) { done(err); })
    .pipe(typedoc(require('./typedoc.js')));
});

gulp.task('compile', ['tslint', 'tsc']);
gulp.task('test', ['tslint', 'jest']);
gulp.task('pre-publish', ['tslint', 'jest', 'tsc', 'typedoc']);
