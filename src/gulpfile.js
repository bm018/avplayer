var gulp = require('gulp'),
autoprefixer = require('gulp-autoprefixer'),
cleanCSS = require('gulp-clean-css'),
rename = require('gulp-rename'),
clean = require('gulp-clean'),
sass = require('gulp-sass'),
scss = require('postcss-scss'),
concat = require('gulp-concat'),
jshint = require('gulp-jshint'),
sourcemaps = require('gulp-sourcemaps'),
readlineSync = require('readline-sync'),
prefixer = require('gulp-autoprefixer'),
browserSync = require('browser-sync').create(),
uglify = require('gulp-uglify');



// Task für Styles
gulp.task('styles', function() {
  if(process.argv[2] === 'watch')
  {
    return gulp
    .src('scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(prefixer({
      browsers: ['last 3 versions', 'IE 9'],
      cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(concat('audio.css'))
    .pipe(gulp.dest('./../css/'))
    .pipe(browserSync.stream());
  }
  else
  {
    gulp.src('scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('./../css/'))
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
  }
});

// watch Task
gulp.task('watch', function() {
  gulp.watch('scss/**/*.scss',['styles']);
});

// clean Task - löscht die Files aus dem dest-Verzeichnis
gulp.task('clean', function() {
  return gulp.src(['./../css/'], {read: false})
  .pipe(clean());
});

// build Task für Styles und Scripts - legt die css Dateien unter dest-Verzeichnis
gulp.task('build', ['clean'], function() {
  gulp.start('styles');
});
