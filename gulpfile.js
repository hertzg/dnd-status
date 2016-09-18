const Gulp = require('gulp')
, Path = require('path')
, Stream = require('stream')
, ChildProcess = require('child_process')
, GulpBower = require('gulp-bower')
, MergeStream = require('merge-stream')
;

const VENDOR_DIR = './www/vendor'

Gulp.task(
  'client:libs:download',
  () => {
    "use strict";
    return GulpBower()
    .pipe(new Stream.PassThrough({objectMode: true}))
    ;
  }
)

Gulp.task(
  'client:libs:copy:font-awesome',
  () => {
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
)

Gulp.task(
  'client:libs:copy:bootstrap',
  () => {
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
)

Gulp.task(
  'client:libs:copy:jquery',
  () => {
    "use strict";

    let pipeLine = MergeStream();
    pipeLine.add(
      Gulp.src('./bower_components/jquery/dist/jquery.min.js')
      .pipe(Gulp.dest(Path.join(VENDOR_DIR, '/jquery/')))
    )

    return pipeLine
  }
)

Gulp.task(
  'client:install',
  Gulp.series('client:libs:download',
  Gulp.parallel(
    'client:libs:copy:bootstrap',
    'client:libs:copy:jquery',
    'client:libs:copy:font-awesome'
  )
)
)

Gulp.task(
  'default',
  Gulp.series('client:install')
)

Gulp.task(
  'dev:serve',
  Gulp.series('client:install', () => {
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
  )
)
