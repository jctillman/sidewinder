var gulp = require('gulp');
var browserify = require('browserify');
var source     = require('vinyl-source-stream');
var babelify = require("babelify");

var path = {
  HTML: 'client/*.html',
  ALL: ['common/js/*.js', 'client/*.html','client/js/*.js','client/css/*.css'],
  JS: ['common/js/*.js','client/js/*.js'],
  CSS: ['client/css/*.css'],
  MINIFIED_OUT: 'bundled.js',
  DEST_BUILD: 'dist' 
}; 

gulp.task('copy', function(){
  gulp.src(path.HTML)
    .pipe(gulp.dest(path.DEST_BUILD));
});

gulp.task('browserify', function() {
    browserify({
            entries: 'client/js/app.js',
            extensions: ['.js']
          })
        .transform(babelify)
        .bundle()
        .pipe(source(path.MINIFIED_OUT))
        .pipe(gulp.dest(path.DEST_BUILD));
});

gulp.task('css', function(){
  gulp.src(path.CSS)
      .pipe(gulp.dest(path.DEST_BUILD));
});


gulp.task('default', function(){
  gulp.start('copy');
  gulp.start('browserify');
  gulp.start('css');
  gulp.watch(path.ALL, ['copy', 'browserify','css']);
});
