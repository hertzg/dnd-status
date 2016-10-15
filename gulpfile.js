const Gulp = require('gulp')
  , Path = require('path')
  , Stream = require('stream')
  , ChildProcess = require('child_process')
  , GulpBower = require('gulp-bower')
  , GulpDebug = require('gulp-debug')
  , GulpSASS = require("gulp-sass")
  , GulpAutoPrefixer = require('gulp-autoprefixer')
  , GulpCleanCSS = require('gulp-clean-css')
  , GulpRename = require('gulp-rename')
  , GulpConcat = require('gulp-concat')
  , GulpConcatCSS = require('gulp-concat-css')
  , GulpUtil = require('gulp-util')
  , GulpUglify = require('gulp-uglify')
  , MergeStream = require('merge-stream')
  ;

const VENDOR_DIR = './www/vendor'

Gulp.task('client:build:css', client_build_css)
Gulp.task('client:build:js', client_build_js)
Gulp.task('client:build', Gulp.series(import_compressibles_from_php, 'client:build:css', 'client:build:js'))
Gulp.task('client:libs:copy:jquery', client_libs_copy_jquery)
Gulp.task('client:libs:copy:bootstrap', client_libs_copy_bootstrap)
Gulp.task('client:libs:copy:font-awesome', client_libs_copy_fontAwesome)
Gulp.task('client:libs:download', client_libs_download)
Gulp.task('client:install',
  Gulp.series('client:libs:download',
    Gulp.parallel(
      'client:libs:copy:bootstrap',
      'client:libs:copy:jquery',
      'client:libs:copy:font-awesome'
    )
  )
)
Gulp.task('dev:serve', dev_serve)
Gulp.task('default', Gulp.series('client:install', 'client:build'))


function client_libs_download() {
  "use strict";
  return GulpBower()
    .pipe(new Stream.PassThrough({objectMode: true}))
    ;
}

function client_libs_copy_fontAwesome() {
  "use strict";

  let pipeLine = MergeStream();
  pipeLine.add(
    Gulp.src('./bower_components/font-awesome/css/font-awesome.min.css')
      .pipe(Gulp.dest(Path.join(VENDOR_DIR, '/font-awesome/css/')))
  )

  pipeLine.add(
    Gulp.src('./bower_components/font-awesome/fonts/*')
      .pipe(Gulp.dest(Path.join(VENDOR_DIR, '/font-awesome/fonts/')))
  )

  return pipeLine;
}

function client_libs_copy_bootstrap() {
  "use strict";

  let pipeLine = MergeStream();
  pipeLine.add(
    Gulp.src('./bower_components/bootstrap/dist/css/bootstrap.min.css')
      .pipe(Gulp.dest(Path.join(VENDOR_DIR, '/bootstrap/css/')))
  )

  pipeLine.add(
    Gulp.src('./bower_components/bootstrap/dist/js/bootstrap.min.js')
      .pipe(Gulp.dest(Path.join(VENDOR_DIR, '/bootstrap/js/')))
  )

  pipeLine.add(
    Gulp.src('./bower_components/bootstrap/dist/fonts/*')
      .pipe(Gulp.dest(Path.join(VENDOR_DIR, '/bootstrap/fonts/')))
  )

  return pipeLine;
}

function client_libs_copy_jquery() {
  "use strict";

  let pipeLine = MergeStream();
  pipeLine.add(
    Gulp.src('./bower_components/jquery/dist/jquery.min.js')
      .pipe(Gulp.dest(Path.join(VENDOR_DIR, '/jquery/')))
  )

  return pipeLine
}

let COMPRESSIBLES_CONFIG;
function import_compressibles_from_php(done) {
  ChildProcess.exec('php -r "include \'www/fns/get_compressible_config.php\'; echo' +
    ' json_encode(get_compressible_config());"', (err, stdout) => {
    COMPRESSIBLES_CONFIG = JSON.parse(stdout.toString('utf-8'));
    done(err)
  })
}

function client_build_css() {

  let pipeline = MergeStream();

  function makePipline(sources, targetDir) {
    return Gulp.src(sources)
      .pipe(GulpDebug())
      .pipe(GulpAutoPrefixer("last 3 versions", "safari 5", "ie 8", "ie9"))
      .pipe(GulpConcatCSS('compressed.css'))
      .pipe(GulpCleanCSS({
        compatibility: 'ie8',
        debug: true
      }, (details) => {
        let {efficiency, timeSpent} = details.stats;
        GulpUtil.log(Path.normalize(Path.join(targetDir, details.name)) + ': ' + Math.round(efficiency * 10000) / 1000 + '% in ' + timeSpent + 'ms')
      }))
      .pipe(GulpRename({suffix: '.min'}))
      .pipe(Gulp.dest(targetDir))
      .pipe(GulpDebug())
      ;
  }

  for (let compressibleKey in COMPRESSIBLES_CONFIG) {
    let compressible = COMPRESSIBLES_CONFIG[compressibleKey];
    if (!compressible.css) {
      continue;
    }

    pipeline.add(
      makePipline(
        compressible.css.files.map(function (v) {
          return Path.normalize(Path.join(compressible.css.directory, v))
        }),
        Path.normalize(compressible.css.targetDir)
      )
    )
  }

  return pipeline
}

function client_build_js() {
  let pipeline = MergeStream();

  function makePipeline(sources, targetDir) {
    return Gulp.src(sources)
      .pipe(GulpDebug())
      .pipe(GulpConcat('compressed.js', {newLine: ';'}))
      .pipe(GulpUglify())
      .pipe(GulpRename({suffix: '.min'}))
      .pipe(Gulp.dest(targetDir))
      .pipe(GulpDebug())
  }

  for (let compressibleKey in COMPRESSIBLES_CONFIG) {
    let compressible = COMPRESSIBLES_CONFIG[compressibleKey];
    if (!compressible.js) {
      continue;
    }

    pipeline.add(
      makePipeline(
        compressible.js.files.map(function (v) {
          return Path.normalize(Path.join(compressible.js.directory, v))
        }),
        Path.normalize(compressible.js.targetDir)
      )
    )
  }

  return pipeline;
}

function dev_serve() {
  return ChildProcess.spawn(
    'php',
    [
      '-d', 'display_errors=On',
      '-S', '127.0.0.1:8888',
      '-t', './www'
    ], {
      cwd: __dirname,
      shell: true,
      stdio: 'inherit'
    }
  );
}
