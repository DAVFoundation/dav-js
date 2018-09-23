const gulp = require('gulp');
const eslint = require('gulp-eslint');
const jest = require('gulp-jest').default;
const exec = require('child_process').exec;
const ts = require('gulp-typescript');
const tslint = require('gulp-tslint');
const typedoc = require('gulp-typedoc');
const sourcemaps = require('gulp-sourcemaps');
const spellcheck = require('gulp-ts-spellcheck').default;
const merge = require('gulp-merge');

gulp.task('deploy-contracts', callback => {
  exec('truffle deploy', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    callback(err);
  });
});

gulp.task('lint', () => {
  return gulp
    .src(['**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('jest', done => {
  return gulp
    .src('')
    .on('error', function(err) {
      done(err);
    })
    .pipe(jest({}));
});

gulp.task('tslint', done => {
  return gulp
    .src(['src/**/*.ts', 'samples/**/*.ts'])
    .on('error', function(err) {
      done(err);
    })
    .pipe(
      tslint({
        formatter: 'prose',
      })
    )
    .pipe(tslint.report());
});

gulp.task('tsc', function(done) {
  var tsProject = ts.createProject('tsconfig.json');
  const tsResults = tsProject
    .src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .on('error', function(err) {
      done(err);
    });

  return merge([
    tsResults.dts.pipe(gulp.dest('./build/')),
    tsResults.js.pipe(sourcemaps.write('')).pipe(gulp.dest('./build')),
  ]);
});

gulp.task('create-dist', ['tsc'], function() {
  gulp.src('./src/contracts/*').pipe(gulp.dest('./dist/contracts/'));
  gulp.src('./build/src/*').pipe(gulp.dest('./dist/'));
});

gulp.task('typedoc', function(done) {
  return gulp
    .src(['src/**/*.ts'])
    .on('error', function(err) {
      done(err);
    })
    .pipe(typedoc(require('./typedoc.js')));
});

gulp.task('spellcheck', function(done) {
  return gulp
    .src(['src/**/*.ts', 'samples/**/*.ts'])
    .on('error', function(err) {
      done(err);
    })
    .pipe(
      spellcheck({
        dictionary: require('./speller-dictionary.js'),
      })
    )
    .pipe(spellcheck.report({}));
});

gulp.task('compile', ['tslint', 'tsc']);
gulp.task('test', ['tslint', 'jest']);
gulp.task('pre-publish', [
  'tslint',
  'jest',
  'tsc',
  'typedoc',
  'spellcheck',
  'create-dist',
]);
