var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    nodemon = require('gulp-nodemon'),
    ts = require('gulp-typescript'),
    clean = require('gulp-clean'),
    shell = require('gulp-shell');


gulp.task('clean', function(){
    return gulp.src(['dist/*', 'build/*'], {read:false})
    .pipe(clean());
});

gulp.task('move', function(){
    gulp.src(['./src/public/**/*.html', './src/public/**/*.js', './src/public/images/**/*.*'], { base: './' })
    .pipe(gulp.dest('dist'));
    return gulp.src(['./build/**/*.js'], { base: './build/' })
    .pipe(gulp.dest('dist/src/'));
});


gulp.task('start', function () {
    runSequence('clean', 'compile', 'move', function(){
        nodemon({
            script: 'dist/src/server.js'
            , ext: 'js html'
            //, env: { 'NODE_ENV': 'development' }
        });
    });
});

gulp.task('compile', shell.task(['tsc --removeComments --module commonjs --outDir build']));
