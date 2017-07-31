var gulp = require('gulp');
var del = require('del');
var ts = require('gulp-typescript');
var useref = require('gulp-useref');
var sass = require('gulp-sass');
var merge = require('merge2');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var exec = require('child_process').exec;
var path = require('path');
var fs = require("fs");

var paths = {
    src: {
        ts: ['./app/ts/**/*.ts'],
        sass: ['./app/sass/**/*.scss'],
        json: ['./app/assets/json/**/*.json'],
        atlas: './app/assets/atlas',
        img: ['./app/assets/images/**/*'],
        fonts: ['./app/assets/fonts/**/*'],
        index: ['./app/index.html']
    },
    dst: {
        css: './app/css/',
        js: './app/js/',
        json: './build/assets/json',
        atlas: './build/assets/atlas',
        img: './build/assets/images',
        fonts: './build/assets/fonts'
    },
    tests: ['./tests/**/*.js']
};

gulp.task('atlas', gulp.series(_generateAtlas));
gulp.task('img', _copy("img"));
gulp.task('fonts', _copy("fonts"));
gulp.task('json', _copy("json"));
gulp.task('sass', gulp.series(_sass));
gulp.task('ts', gulp.series(_ts));
gulp.task('useref', gulp.series('ts', 'sass', 'img', 'fonts', 'json', 'atlas', _useref));
gulp.task('watch', gulp.series('useref', _watch));
gulp.task('default', gulp.series('watch'));

function _watch (done) {
    gulp.watch(paths.src.img, gulp.series('img', _useref));
    gulp.watch(paths.src.fonts, gulp.series('fonts', _useref));
    gulp.watch(paths.src.json, gulp.series('json', _useref));
    gulp.watch(paths.src.sass, gulp.series('sass', _useref));
    gulp.watch(paths.src.ts, gulp.series('ts', _useref));
    gulp.watch(paths.src.ts, gulp.series('atlas', _useref));
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

function _copyMessages(done) {
    del(paths.dst.messages)
        .then(function() {
            gulp.src(paths.src.messages)
                .pipe(gulp.dest(paths.dst.messages));
            done();
        });
}

function _copy(type) {
    return function (done) {
        del(paths.dst[type])
            .then(function() {
                gulp.src(paths.src[type])
                    .pipe(gulp.dest(paths.dst[type]));
                done();
            });
    };
}

function _generateAtlas(done) {
    try { fs.mkdirSync(paths.dst.atlas); } catch (e) {}
    fs.readdir(paths.src.atlas, {}, function (err, files) {
        var atlases = [];
        for (var i = 0; i < files.length; ++i) {
            var file = path.format({
                dir: paths.src.atlas,
                base: files[i]
            });
            var info = fs.statSync(file);
            if (info && info.isDirectory()) {
                atlases.push({
                    name: files[i],
                    path: file
                });
            }
        }
        var cmds = [];
        for (i = 0; i < atlases.length; ++i) {
            var cmd = 'spritesheet-js ' + atlases[i].path + '/* ' +
                '--format jsonarray --trim --padding 1 ' +
                '--path ' + paths.dst.atlas + ' --name ' + atlases[i].name;
            cmds.push(cmd);
        }
        exec(cmds.join("; "), function (err) {
            if (err) throw err;
            console.info('spritesheet successfully generated');
            done();
        });
    });
}
