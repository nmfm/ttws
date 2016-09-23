// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// todo: sending the events not directly on there tags instead use a neutral way

const exec = require('child_process').execFile;

var watchversion = {};
var updatebutton = {};
var icon = {};
var succesdialog = {};
riot.compile(function() {
  watchversion = riot.mount('watchversion')[0];
  updatebutton = riot.mount('updatebutton')[0];
  icon = riot.mount('icon')[0];
  succesdialog = riot.mount('succesdialog')[0];

  function getVersion() {
    icon.trigger('watch.progress.start');
    exec('/usr/local/bin/ttwatch', ['-v'],
      (error, stdout, stderr) => {
        if (error !== null) {
          console.error(error);
          watchversion.trigger('watch.version.error', error.message);
        } else {
          watchversion.trigger('watch.version.succes', stdout);
        }
        icon.trigger('watch.progress.stop');
      }
    );
  }

  updatebutton.on('watch.update.firmware', function() {
    icon.trigger('watch.progress.start');
    exec('/usr/local/bin/ttwatch', ['--update-fw'],
      (error, stdout, stderr) => {
        if (error !== null) {
          console.error(error);
          watchversion.trigger('watch.update.error', error.message);
        } else {
          let message = stdout;
          if (message === '') {
            // Thats a fallback because in case of up to date the output goes to stderr but the app is returning with succes
            message = stderr;
          }
          succesdialog.trigger('watch.succesdialog.message', message);
        }
        icon.trigger('watch.progress.stop');
      }
    );
  });

  updatebutton.on('watch.update.gps', function() {
    icon.trigger('watch.progress.start');
    exec('/usr/local/bin/ttwatch', ['--update-gps'],
      (error, stdout, stderr) => {
        if (error !== null) {
          console.error(error);
          succesdialog.trigger('watch.succesdialog.message', stderr);
        } else {
          succesdialog.trigger('watch.succesdialog.message', stdout);
        }
        icon.trigger('watch.progress.stop');
      }
    );
  });

  updatebutton.on('watch.update.time', function() {
    icon.trigger('watch.progress.start');
    exec('/usr/local/bin/ttwatch', ['--set-time'],
      (error, stdout, stderr) => {
        if (error !== null) {
          console.error(error);
          succesdialog.trigger('watch.succesdialog.message', stderr);
        } else {
          succesdialog.trigger('watch.succesdialog.message', 'Successfully updated the time on the watc on the watch.');
        }
        icon.trigger('watch.progress.stop');
      }
    );
  });

  getVersion();
  setInterval(getVersion, 5000);
});


// ttwatch --get-activities --activity-store=./ goes under ./<watch name>/<date>/<file.ttbin>
// ttbincnv -g mascha/2016-09-22/Cycling_16-44-30.ttbin to gpx file
// ttbincnv -g mascha/2016-09-22/Cycling_16-44-30.ttbin to tcx file
//
