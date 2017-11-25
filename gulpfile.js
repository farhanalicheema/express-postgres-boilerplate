var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var pkg = require('./package.json');
var concat = require('gulp-concat');


var paths = {
    sass: './public-src/scss/**/*.scss',
    css_src: './sources/css/**/*.css',
    css: './public/css',
    js_src: './sources/js/**/*.js',
    js: './public/js',
    img_src: './sources/img/**/*',
    img: './public/img',
    fonts_src: './sources/fonts/*',
    fonts: './public/fonts'
};

gulp.task('minstyles', function () {
    return gulp.src([
        './sources/vendor/bootstrap/css/bootstrap.min.css',
        './sources/vendor/metisMenu/metisMenu.min.css',
        './sources/vendor/datatables-plugins/dataTables.bootstrap.css',
        './sources/vendor/datatables-responsive/dataTables.responsive.css',
        './sources/js/bootstrap-datepicker/css/bootstrap-datepicker.css',
        './sources/assets/clockpicker/src/clockpicker.css',
        './sources/dist/css/sb-admin-2.css',
        './sources/vendor/morrisjs/morris.css',
        './sources/vendor/font-awesome/css/font-awesome.min.css',
        paths.css_src
    ])
        .pipe(concat('minstyles.min.js'))
        .pipe(minifyCss())
        .pipe(rename('minstyles.min.css'))
        .pipe(gulp.dest(paths.css));
});

gulp.task('minscripts', function () {
    return gulp.src([
        // Core
        './sources/vendor/jquery/jquery.min.js',
        './sources/vendor/bootstrap/js/bootstrap.min.js',
        './sources/vendor/metisMenu/metisMenu.min.js',
        // Plugins
        './sources/vendor/datatables/js/jquery.dataTables.min.js',
        './source/vendor/datatables-plugins/dataTables.bootstrap.min.js',
        './sources/assets/bootstrap-datepicker/js/bootstrap-datepicker.js',
        './sources/assets/clockpicker/src/clockpicker.js',
        './sources/assets/bootstrap-filestyle-1.2.3/src/bootstrap-filestyle.js',
        // Scripts
        './sources/vendor/datatables-responsive/dataTables.responsive.js',
        './sources/vendor/raphael/raphael.min.js',
        './sources/vendor/morrisjs/morris.min.js',
        // './sources/data/morris-data.js',
        './sources/dist/js/sb-admin-2.js',
        paths.js_src
    ])
        .pipe(concat('minscripts.min.js'))
        .pipe(uglify())
        .pipe(rename('minscripts.min.js'))
        .pipe(gulp.dest(paths.js));
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', function () {

    gulp.src([paths.fonts_src])
        .pipe(gulp.dest(paths.fonts))


    gulp.src([paths.img_src])
        .pipe(gulp.dest(paths.img))
})

// Run everything
gulp.task('default', ['minscripts', 'minstyles', 'copy']);

// Configure the browserSync task
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: ''
        },
    })
})

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'less', 'minify-css', 'minify-js'], function () {
    gulp.watch('less/*.less', ['less']);
    gulp.watch('css/*.css', ['minify-css']);
    gulp.watch('js/*.js', ['minify-js']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('js/**/*.js', browserSync.reload);
});
