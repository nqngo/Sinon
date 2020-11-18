const { progressBar, lineBreak } = require('../Utilities/utils.js');
const { effectSetUp } = require('../Utilities/fileSetUp.js');
const { convertAlert } = require('../alerts/convertAlert.js');
const { errorAlert } = require('../alerts/errorAlert.js');
const { successAlert } = require('../alerts/successAlert.js');

async function concat(multi, swalColour, format, targetFiles) {
  return new Promise((resolve) => {
    let ffmpegInputs = ffmpeg();
    let fileSettings;
    var getInputs = new Promise((resolve) => {
      targetFiles.forEach(async function (fileSelected, index, array) {
        fileSettings = effectSetUp(fileSelected);
        ffmpegInputs = ffmpegInputs.input(fileSettings.inputFull);
        if (index === array.length - 1) resolve();
        return ffmpegInputs;
      });
    });
    getInputs.then(() => {
      lineBreak();
      convertAlert(swalColour);
      console.log(ffmpegInputs);
      var finalOutput = fileSettings.outputFile + '-Sinon-Joined.mp4';
      ffmpegInputs
        .on('progress', function (progress) {
          progressBar(progress, format);
        })
        .on('error', function (err) {
          errorAlert('', 'effect', err, swalColour, '');
        })
        .mergeToFile(finalOutput)
        .outputOptions(['-map 0:a?'])
        .on('end', function () {
          console.log('Merge Success!');
          win.setProgressBar(-1);
          resolve('Concat finished');
          if (multi == false) {
            successAlert('effect', 'Clips merged', swalColour);
          }
        });
    });
  });
}

module.exports = concat;
