'use strict';
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const merge = require('merge-stream');
const concat = require('gulp-concat');
//const minify = require('gulp-minify-css');
const plumber = require('gulp-plumber');
const del = require('del');
const imagemin = require('gulp-imagemin');
const jslint = require('gulp-jslint');

const paths = {
    styles_sass: './styles/sass/**/*.scss',
    styles_css: './styles/css/**/*.css',
    images: './img/**/*',
    scripts: './js/libs/**/*.js',
    build_css: './styles/styles.css'
};

function clean() {
    // You can use multiple globbing patterns as you would with `gulp.src`
    return del(['build']);
}

// Copy all static images
gulp.task('images', gulp.series(clean, () => {
    return (
        gulp
        .src(paths.images)
        // Pass in options to the task
        .pipe(imagemin({
            optimizationLevel: 5
        }))
        .pipe(gulp.dest('build/img'))
    );
}));

gulp.task('scripts', gulp.series(clean, () => {
    // Minify and copy all JavaScript (except vendor scripts) with sourcemaps all the way down
    return gulp
        .src(paths.scripts)
        .pipe(
            jslint({
                /* this object represents the JSLint directives being passed down */
            })
        )
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(uglify())
        .pipe(concat('scripts.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./js'))
        .pipe(browserSync.stream());
}));

//Create style css combined with sass and css includes autoprefixed and minified with sourcemap
function styles() {
    var cssStream = gulp
        .src([paths.styles_css])
        .pipe(sourcemaps.init())
        //.pipe(minify())
        .pipe(concat('css-files.css'));

    var sassStream = gulp
        .src(paths.styles_sass)
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(
            sass({
                outputStyle: 'compressed',
                sourcemap: true
            }).on(
                'error',
                sass.logError
            )
        )
        //.pipe(minify())
        .pipe(autoprefixer())
        .pipe(concat('scss-files.scss'));

    var mergedStream = merge(cssStream, sassStream)
        .pipe(concat(paths.build_css))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./'))
        .pipe(browserSync.stream());

    return mergedStream;
}

// Static server browser sync
function browser_sync() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    gulp.watch('*.html').on('change', reload);
}

function watch() {
    gulp.watch(paths.styles_sass, styles);
    gulp.watch(paths.scripts, gulp.series('scripts'));
}

const build = gulp.series(clean, gulp.parallel(browser_sync, watch));

exports.clean = clean;
exports.styles = styles;
exports.browser_sync = browser_sync;
exports.default = build;