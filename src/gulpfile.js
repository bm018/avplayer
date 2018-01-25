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
    urlAdjuster = require('gulp-css-url-adjuster');

// --------------------------------- AUDIO --------------------------------- //

// build styles audio player
gulp.task('styles-audio', function() {
    // build styles audio
    gulp.src('scss-audio/**/*.scss')
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
gulp.task('watch-styles-audio', function() {
    gulp.watch('scss-audio/**/*.scss',['styles-audio']);
});

// build scripts audio player
gulp.task('scripts-audio', function() {
    gulp.src(['js-audio/modules/**'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('audio.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

// watch task for scripts audio player
gulp.task('watch-scripts-audio', function() {
    gulp.watch('js-audio/**/*.js',['scripts-audio']);
});

// watch task for styles & scripts audio player
gulp.task('watch-audio', function() {
    gulp.watch('scss-audio/**/*.scss',['styles-audio']);
    gulp.watch('js-audio/**/*.js',['scripts-audio']);
});

// build task for styles & scripts audio player
gulp.task('build-audio', function() {
    gulp.start('styles-audio', 'scripts-audio');
});

// --------------------------------- AUDIO END --------------------------------- //

// --------------------------------- VIDEO --------------------------------- //

// build styles pages video player
gulp.task('styles-video-pages', function(){
    gulp.src('scss-video/pages/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 3 version', 'android 4'))
        .pipe(gulp.dest('./dist/css/pages/'))
        .pipe(minifycss())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dist/css/pages/'));
});

gulp.task('watch-styles-video-pages', function() {
    gulp.watch('scss-video/pages/_contentheader-premium.scss',['styles-video-pages']);
});

// build styles video player
// does not work currently because relative paths in main.css are not rewritten!
gulp.task('styles-video', function() {
    gulp.src([
            'scss-video/vendor/main.css',
            'scss-video/vendor/AddonUntertitel.css'
        ])
        .pipe(concat('video.css'))
        .pipe(gulp.dest('./dist/css/vendor'))
        .pipe(minifycss())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dist/css/vendor'));

    // build styles video
    gulp.src('scss-video/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 3 version', 'android 4'))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(minifycss())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dist/css/'));
});

// watch task for styles video player
gulp.task('watch-styles-video', function() {
    gulp.watch('scss-video/**/*.scss',['styles-video']);
});

// build scripts video player
gulp.task('scripts-video', function() {
    gulp.src([
            'js-video/libs/jquery.tools-1.2.7.min.js',
            'js-video/libs/jquery-ui-1.10.4.min.js',
            'js-video/libs/swfobject.js',
            'js-video/libs/mm.useractivity.js',
            'js-video/libs/json2.js',
            'js-video/libs/jquery.cookie.js',
            'js-video/libs/shortcut.js',
            'js-video/libs/bigscreen.min.js',
            'js-video/libs/hls-0.7.11.light.min.js',
            'js-video/libs/TweenLite.min.js',
            'js-video/libs/Draggable.min.js',
            'js-video/libs/CSSPlugin.min.js'
        ])
        .pipe(concat('video-libs.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));

    gulp.src([
            'js-video/vendor/namespace.js',
            'js-video/vendor/core/AbstractPlayerCtrl.js',
            'js-video/vendor/core/AbstractCorePlugin.js',
            'js-video/vendor/core/HtmlVideoCtrl.js',
            'js-video/vendor/core/HtmlAudioCtrl.js',
            'js-video/vendor/core/FlashPluginCtrl.js',
            'js-video/vendor/core/Player.js',
            'js-video/vendor/model/vo/PlayerConfiguration.js',
            'js-video/vendor/model/vo/Media.js',
            'js-video/vendor/model/vo/MediaCollection.js',
            'js-video/vendor/model/vo/MediaStream.js',
            'js-video/vendor/model/VideoSources.js',
            'js-video/vendor/model/PlayerModel.js',
            'js-video/vendor/controller/KeyboardPlayerController.js',
            'js-video/vendor/utils/GUID.js',
            'js-video/vendor/utils/QueryParser.js',
            'js-video/vendor/utils/DateUtils.js',
            'js-video/vendor/utils/Cookie.js',
            'js-video/vendor/utils/Html5MEFactory.js',
            'js-video/vendor/model/GlobalModel.js',
            'js-video/vendor/views/ViewController.js',
            'js-video/vendor/views/ResponsiveImage.js',
            'js-video/vendor/views/TimelineSlider.js',
            'js-video/vendor/controller/ErrorController.js',
            'js-video/vendor/controller/PlayerPixelController.js',
            'js-video/vendor/business/GetPlayerModelCmd.js',
            'js-video/vendor/business/GenerateFlashPluginCmd.js',
            'js-video/vendor/business/InitPlayerCmd.js',
            'js-video/vendor/business/GetPlayerConfigByQueryCmd.js',
            'js-video/vendor/business/GetPlayerConfigByJsonCmd.js',
            'js-video/vendor/business/GetMediaCollectionByQueryCmd.js',
            'js-video/vendor/business/GetMediaCollectionByJsonCmd.js',
            'js-video/vendor/business/GenerateHTMLVideoCmd.js',
            'js-video/vendor/business/GenerateHTMLAudioCmd.js',
            'js-video/vendor/core/plugins.js',
            'js-video/vendor/core/script.js',
            'js-video/vendor/addons/untertitel/js/AddonUntertitel.js',
            'js-video/vendor/addons/untertitel/js/controller/SubtitleController.js'
        ])
        .pipe(concat('video.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

// watch task for scripts video player
gulp.task('watch-scripts-video', function() {
    gulp.watch('js-video/**/*.js',['scripts-video']);
});

// watch task for styles & scripts video player
gulp.task('watch-video', function() {
    gulp.watch('scss-video/**/*.scss',['styles-video']);
    gulp.watch('js-video/**/*.js',['scripts-video']);
});

// build task for styles & scripts video player
gulp.task('build-video', function() {
    gulp.start('styles-video', 'scripts-video', 'styles-video-pages');
});

// --------------------------------- VIDEO END --------------------------------- //

//
gulp.task('build-production-urls', function() {
    gulp.src(['./dist/css/*.css', './dist/css/pages/*.css']).
      pipe(urlAdjuster({
        prepend: '/basis/avplayer/files/ardplayer-3.9.0/base/',
        append: '?version=1',
      }))
      .pipe(gulp.dest('./dist/production/css/'));
});
//

// --------------------------------- GENERAL --------------------------------- //

// clean styles & scripts of audio & video player
gulp.task('clean', function() {
  return gulp.src(['./dist/css', './dist/js'], {read: false})
    .pipe(clean());
});

// watch task for styles & scripts of audio & video player
gulp.task('watch', function() {
    gulp.start('watch-audio', 'watch-video');
});

// build task for styles & scripts of audio & video player
gulp.task('build', ['clean'], function() {
    gulp.start('build-audio', 'build-video');
});

// --------------------------------- GENERAL END --------------------------------- //
