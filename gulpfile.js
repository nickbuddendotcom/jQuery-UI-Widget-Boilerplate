var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    refresh     = require('gulp-livereload'),
    lr          = require('tiny-lr'),
    server      = lr(),
    prefix      = require('gulp-autoprefixer'),
    plumber     = require('gulp-plumber'),
    notify      = require('gulp-notify'),
    clean       = require('gulp-clean'),
    jshint      = require('gulp-jshint'),
    uglify      = require('gulp-uglify'),
    rename      = require('gulp-rename'),
    imagemin    = require('gulp-imagemin'),
    minifyCSS   = require('gulp-minify-css'),
    embedlr     = require('gulp-embedlr');

gulp.task('clean', function() {
  gulp.src(['dist/**/*'], { read: false })
    .pipe(clean());
});

gulp.task('scripts', function() {
  gulp.src(['src/*.js'])
    .pipe(plumber())
    .pipe(jshint())
      .on('error', notify.onError())
    .pipe(gulp.dest('dist'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
    .pipe(refresh(server));
});

gulp.task('styles', function() {
  gulp.src(['src/scss/**/*.scss'])
    .pipe(plumber())
    .pipe(sass())
      .on('error', notify.onError())
    .pipe(prefix("last 1 version", "> 1%", "ie 9"))
    .pipe(gulp.dest('dist/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifyCSS())
    .pipe(gulp.dest('dist/css'))
    .pipe(refresh(server));
});

gulp.task('lr-server', function() {
  server.listen(3000, function(err) {
    if(err) return console.log(err);
  });
});

gulp.task('images', function () {
  gulp.src('src/img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'));
});

gulp.task('default', ['clean'], function() {
  gulp.run('lr-server', 'scripts', 'styles');

  gulp.watch('src/*.js', function(event) {
    gulp.run('scripts');
  });

  gulp.watch('src/scss/**/*', function(event) {
    gulp.run('styles');
  });

  gulp.watch('src/img/**/*', function(event) {
    gulp.run('images');
  });
});