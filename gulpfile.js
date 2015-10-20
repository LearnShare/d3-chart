var del = require('del'),
    vp = require('vinyl-paths'),
    gulp = require('gulp'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    templateCache = require('gulp-angular-templatecache'),
    htmlmin = require('gulp-htmlmin'),
    less = require('gulp-less'),
    cssmin = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rev = require('gulp-rev'),
    revReplace = require('gulp-rev-replace');

// clean tmp/dist/manifest/templates
gulp.task('clean', function() {
  return gulp.src([
    'tmp/',
    'dist/'
  ])
  .pipe(vp(del));
});

// combine templates to single Angular module
gulp.task('templates', ['clean'], function() {
  return gulp.src('demo/views/**/*.html')
      .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true
      }))
      .pipe(templateCache({
        root: 'views/'
      }))
      .pipe(replace('angular.module("templates")', 'app'))
      .pipe(gulp.dest('tmp/js/'));
});

// htmlmin index
gulp.task('htmlmin-index', ['clean'], function() {
  return gulp.src('demo/index-release.html')
      .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true
      }))
      .pipe(rename('index.html'))
      .pipe(gulp.dest('tmp/'));
});

// less to css, css concat and min
gulp.task('less-css', ['clean'], function() {
  return gulp.src([
        'bower_components/font-awesome/css/font-awesome.css',
        'bower_components/bootstrap/dist/css/bootstrap.css',
        'demo/css/main.less'
      ])
      .pipe(less())
      .pipe(concat('main.css'))
      .pipe(cssmin())
      .pipe(gulp.dest('tmp/css/'));
});

// copy images
gulp.task('copy-images', ['clean'], function(){
  return gulp.src('demo/images/*.*')
    .pipe(gulp.dest('dist/images/'));
});

// copy fonts
gulp.task('copy-fonts', ['clean'], function(){
  return gulp.src([
      'bower_components/bootstrap/fonts/*.*',
      'bower_components/font-awesome/fonts/*.*'
    ])
    .pipe(gulp.dest('dist/fonts/'));
});

// concat all js file
gulp.task('concat', ['templates'], function() {
  return gulp.src([
        'bower_components/angular/angular.js',
        'bower_components/angular-route/angular-route.js',
        'bower_components/d3/d3.js',
        'demo/js/app.js',
        'tmp/js/templates.js',
        'src/chart.js',
        'src/line-chart.js',
        'src/bar-chart.js',
        'src/pie-chart.js',
        'demo/js/directives/**/*.js',
        'demo/js/controllers/**/*.js'
      ])
      .pipe(concat('main.js'))
      .pipe(uglify())
      .pipe(gulp.dest('tmp/js/'));
});

gulp.task('revision', [
  'htmlmin-index',
  'less-css',
  'copy-fonts',
  'copy-images',
  'concat'
], function() {
  return gulp.src([
        'tmp/js/main.js',
        'tmp/css/main.css'
      ])
      .pipe(rev())
      .pipe(gulp.dest('dist/assets'))
      .pipe(rev.manifest())
      .pipe(gulp.dest('tmp/'));
});

gulp.task('rev-replace', ['revision'], function() {
  return gulp.src('tmp/index.html')
      .pipe(revReplace({
        manifest: gulp.src('tmp/rev-manifest.json')
      }))
      .pipe(gulp.dest('dist/'))
});

// task release
gulp.task('release', [
  'rev-replace'
]);

// task default
gulp.task('default', [
  'release'
]);
