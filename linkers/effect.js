const { errorAlert } = require('./alerts/errorAlert');
const { runningAlert } = require('./alerts/runningAlert');
const { successAlert } = require('./alerts/successAlert');
const { remote, ipcRenderer } = require('electron');
//Effects
const { screengrabs } = require('./effects/screengrab');
const { socialBlur } = require('./effects/blur');
const { concat } = require('./effects/concat');
const { wave } = require('./effects/wave');
import Swal from 'sweetalert2';
const rimraf = require("rimraf");
async function run_effect() {
    lineBreak();
    let swalColour = swalColours();
    var outputFile, inputFull, inputExt, inputDir, pngFolder, inputName, finalOutput;
    var e = document.getElementById("convertFormat");
    let format = e.options[e.selectedIndex].value;
    //WAVE
    // SINGLE
    async function singleEffect(format) {
        if (format.indexOf('wave') >= 0) {
            await wave(multi, swalColour, format);
        }
        if (format.indexOf('blur') >= 0) {
            await socialBlur(multi, swalColour, format);
        }
        if (format.indexOf('grabs') >= 0) {
            await screengrabs(multi, swalColour, format);
        }
        if (format.indexOf('concat') >= 0) {
            await concat(multi, swalColour, format);
        }
    }
    //CUSTOM
    if (format.indexOf('custom') >= 0) {
        Swal.fire({
            icon: 'info',
            title: "Pick your effects",
            text: "What effects do you want to run?",
            html: "<div style='display: flex; flex-direction: column; justify-content: center; align-items: center; width:100%'>" +
                "<div class='select' style='width:50vw !important; margin-top: 1vh'>" +
                "<select id='custom_one' class='convFormat'>" +
                "<option value='concat'>Join clips</option>" +
                "<option value='blur'>Social Media Blur</option>" +
                "<option value='wave'>Generate Waveform</option>" +
                "<option value='grabs'>Get Screengrabs</option>" +
                "</select>" +
                "</div>" +
                "<div class='select' style='width:50vw !important; margin-top: 1vh'>" +
                "<select id='custom_two' class='convFormat' classNamePrefix='conv'>" +
                "<option value='blur'>Social Media Blur</option>" +
                "<option value='wave'>Generate Waveform</option>" +
                "<option value='grabs'>Get Screengrabs</option>" +
                "</select>" +
                "</div>" +
                "<div class='select' style='width:50vw !important; margin-top: 1vh'>" +
                "<select id='custom_three' class='convFormat' classNamePrefix='conv'>" +
                "<option value='blank'>N/A</option>" +
                "<option value='blur'>Social Media Blur</option>" +
                "<option value='wave'>Generate Waveform</option>" +
                "<option value='grabs'>Get Screengrabs</option>" +
                "</select>" +
                "</div>" +
                "</div>",
            confirmButtonText: 'Run!',
            showLoaderOnConfirm: true,
            backdrop: swalColour.loading,
            target: document.getElementById('swalframe'),
            preConfirm: (async () => {
                var custom_get = document.getElementById("custom_one");
                format = custom_get.options[custom_get.selectedIndex].value;
                var custom_get = document.getElementById("custom_two");
                let custom_two = custom_get.options[custom_get.selectedIndex].value;
                var custom_get = document.getElementById("custom_three");
                let custom_three = custom_get.options[custom_get.selectedIndex].value;
                var multi = true;
                let nextStep = false;
                console.log('Running effect one, code: ' + format);
                await singleEffect(format);
                format = custom_two;
                effectFile = [finalOutput];
                console.log('Running effect two, code: ' + format);
                await singleEffect(format);
                if (custom_three.indexOf('blank') <= 0) {
                    format = custom_three;
                    effectFile = [finalOutput];
                    console.log('Running effect three, code: ' + format);
                    await singleEffect(format);
                }
                Swal.fire({
                    icon: 'success',
                    title: "Merge Success!",
                    backdrop: swalColour.pass,
                });
                console.log('Custom effect finished');
            })
        });
    }
    else {
        var multi = false;
        await singleEffect(format);
    }
}
;
