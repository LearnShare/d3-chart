var del = require('del'),
    gulp = require('gulp'),
    htmlmin = require('gulp-htmlmin'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

// clean app-dist
gulp.task('clean', function() {
  del([
    'app-dist/'
  ]);
});

// htmlmin templates
gulp.task('htmlmin', function() {
  gulp.src('app/views/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('app-dist/views/'));
});

// htmlmin index
gulp.task('htmlmin-index', function() {
  gulp.src('app/index.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('app-dist/'));
});

// concat all js file
gulp.task('concat', function() {
  gulp.src([
      'app/vendors/angular/angular.js',
      'app/vendors/angular-route/angular-route.js',
      'app/js/app.js',
      'app/js/controllers/**/*.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app-dist/js/'));
});

// task release
gulp.task('release', [
  'htmlmin',
  'htmlmin-index',

  'concat'
]);

// task default
gulp.task('default', [
  'release'
]);
