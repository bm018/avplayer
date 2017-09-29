// Support of old node versions
require('es6-promise').polyfill();

var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    scss = require('postcss-scss'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify');

// build styles audio player
gulp.task('styles', function() {
    gulp.src('scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 3 version', 'android 4'))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(minifycss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/css/'));
});

// watch task for styles audio player
gulp.task('watch styles', function() {
    gulp.watch('scss/**/*.scss',['styles']);
});

// build scripts audio player
gulp.task('scripts', function() {
    gulp.src(['js/audio.js', 'js/modules/**'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('audio.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

// watch task for scripts audio player
gulp.task('watch scripts', function() {
    gulp.watch('js/**/*.js',['scripts']);
});

// watch task for styles & scripts audio player
gulp.task('watch', function() {
    gulp.watch('scss/**/*.scss',['styles']);
    gulp.watch('js/**/*.js',['scripts']);
});

// clean styles & scripts audio player
gulp.task('clean', function() {
  return gulp.src(['./dist/css', './dist/js'], {read: false})
    .pipe(clean());
});

// build task for styles & scripts audio player
gulp.task('build', ['clean'], function() {
    gulp.start('styles', 'scripts');
});
