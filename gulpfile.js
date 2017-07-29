var gulp = require('gulp');
var del = require('del');
var ts = require('gulp-typescript');
var useref = require('gulp-useref');
var sass = require('gulp-sass');
var merge = require('merge2');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');

var paths = {
    src: {
        ts: ['./app/ts/**/*.ts'],
        sass: ['./app/sass/**/*.scss'],
        atlas: './app/assets/atlas',
        img: ['./app/assets/images/**/*'],
        fonts: ['./app/assets/fonts/**/*'],
        index: ['./app/index.html']
    },
    dst: {
        css: './app/css/',
        js: './app/js/',
        atlas: './build/assets/atlas',
        img: './build/assets/images',
        fonts: './build/assets/fonts'
    },
    tests: ['./tests/**/*.js']
};

gulp.task('img', _copyImages);
gulp.task('fonts', _copyFonts);
gulp.task('sass', gulp.series(_sass));
gulp.task('ts', gulp.series(_ts));
gulp.task('useref', gulp.series('ts', 'sass', 'img', 'fonts', _useref));
gulp.task('watch', gulp.series('useref', _watch));
gulp.task('default', gulp.series('watch'));

function _watch (done) {
    gulp.watch(paths.src.img, gulp.series('img', _useref));
    gulp.watch(paths.src.fonts, gulp.series('fonts', _useref));
    gulp.watch(paths.src.sass, gulp.series('sass', _useref));
    gulp.watch(paths.src.ts, gulp.series('ts', _useref));
    gulp.watch(paths.src.index, gulp.series(_useref));
    done();
}

function _ts () {
    var tsResult = gulp.src(paths.src.ts)
        .pipe(ts({
            declaration: true,
            removeComments: true
        }));

    return merge(
        tsResult.dts.pipe(gulp.dest('./app/js/definitions')),
        tsResult.js.pipe(gulp.dest('./app/js/release'))
    );
}

function _sass() {
    return gulp.src(paths.src.sass)
        .pipe(sass({errLogToConsole: true}))
        .pipe(gulp.dest(paths.dst.css))
        .pipe(cleanCss())
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest(paths.dst.css));
}

function _useref() {
    return gulp.src(paths.src.index)
        .pipe(useref())
        .pipe(gulp.dest('build'));
}

function _copyImages(done) {
    del(paths.dst.img)
        .then(function() {
            gulp.src(paths.src.img)
                .pipe(gulp.dest(paths.dst.img));
            done();
        });
}

function _copyFonts(done) {
    del(paths.dst.fonts)
        .then(function() {
            gulp.src(paths.src.fonts)
                .pipe(gulp.dest(paths.dst.fonts));
            done();
        });
}
