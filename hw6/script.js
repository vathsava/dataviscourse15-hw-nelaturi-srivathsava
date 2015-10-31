/*globals VolumeRenderer, d3, console*/

var red=128, green=128, blue=128,Yellow=128,Pink=128,alpha=0.5;
var currentValue=0.25;
var renderer,
    allHistograms = {};

function updateTransferFunction() {
    renderer.updateTransferFunction(function (value) {
        // ******* Your solution here! *******

        value= value*alpha;
        if(value>=0.0 && value <0.20)
        {
            return 'rgba(0,'+green+',0,' + value + ')';
        }
        else  if(value>=0.20 && value <0.40)
        {
            return 'rgba('+red+',0,0,' + value + ')';
        }
        else  if(value>=0.40 && value <0.60)
        {
            return 'rgba(0,0,'+blue+',' + value + ')';
        }
        else  if(value>=0.60 && value <0.80)
        {
            return 'rgba(128,128,'+Yellow+',' + value + ')';

        }
        else
        {
            return 'rgba(128,'+Pink+',128,' + value + ')';

        }
        // Given a voxel value in the range [0.0, 1.0],
        // return a (probably somewhat transparent) color
        
       // return 'rgba('+red+','+green+','+blue+',' + value + ')';
    });
}

function setup() {
    d3.select('#volumeMenu').on('change', function () {
        renderer.switchVolume(this.value);
        console.log(this.value + ' histogram:', getHistogram(this.value, 0.025));
        updateTransferFunction();
    });
    console.log('bonsai histogram:', getHistogram('bonsai', 0.025));
}

/*

You shouldn't need to edit any code beyond this point
(though, as this assignment is more open-ended, you are
welcome to edit as you see fit)

*/


function getHistogram(volumeName, binSize) {
    /*
    This function resamples the histogram
    and returns bins from 0.0 to 1.0 with
    the appropriate counts
    (binSize should be between 0.0 and 1.0)
    
    */
    
    var steps = 256,    // the original histograms ranges from 0-255, not 0.0-1.0
        result = [],
        thisBin,
        i = 0.0,
        j,
        nextBin;
    while (i < 1.0) {
        thisBin = {
            count : 0,
            lowBound : i,
            highBound : i + binSize
        };
        j = Math.floor(i * steps);
        nextBin = Math.floor((i + binSize) * steps);
        while (j < nextBin && j < steps) {
            thisBin.count += Number(allHistograms[volumeName][j].count);
            j += 1;
        }
        i += binSize;
        result.push(thisBin);
    }
    return result;
}

/*
Program execution starts here:

We create a VolumeRenderer once we've loaded all the csv files,
and VolumeRenderer calls setup() once it has finished loading
its volumes and shader code

*/
var loadedHistograms = 0,
    volumeName,
    histogramsToLoad = {
        'bonsai' : 'volumes/bonsai.histogram.csv',
        'foot' : 'volumes/foot.histogram.csv',
        'teapot' : 'volumes/teapot.histogram.csv'
    };

function generateCollector(name) {
    /*
    This may seem like an odd pattern; why are we generating a function instead of
    doing this inline?
    
    The trick is that the "volumeName" variable in the for loop below changes, but the callbacks
    are asynchronous; by the time any of the files are loaded, "volumeName" will always refer
    to "teapot"**. By generating a function this way, we are storing "volumeName" at the time that
    the call is issued in "name".
    
    ** This is yet ANOTHER javascript quirk: technically, the order that javascript iterates
    over an object's properties is arbitrary (you wouldn't want to rely on the last value
    actually being "teapot"), though in practice most browsers iterate in the order that
    properties were originally assigned.
    
    */
    return function (error, data) {
        if (error) {
            throw new Error("Encountered a problem loading the histograms!");
        }
        allHistograms[name] = data;
        loadedHistograms += 1;
        
        if (loadedHistograms === Object.keys(histogramsToLoad).length) {
            renderer = new VolumeRenderer('renderContainer', {
                'bonsai': 'volumes/bonsai.raw.png',
                'foot': 'volumes/foot.raw.png',
                'teapot': 'volumes/teapot.raw.png'
            }, setup);
        }
    };
}

for(volumeName in histogramsToLoad) {
    if (histogramsToLoad.hasOwnProperty(volumeName)) {
        d3.csv(histogramsToLoad[volumeName], generateCollector(volumeName));
    }
}

function uRed(val)
{

    $("#Red").attr("style","height: 30px; width: 60px; background-color:rgb("+val+",0,0"+")");
    red=val;
    $("#RValDiv").text(val);
    updateTransferFunction();

}
function uGreen(val)
{

    $("#Green").attr("style","height: 30px; width: 60px; background-color:rgb(0,"+val+",0"+")");
    green=val;
    $("#GValDiv").text(val);
    updateTransferFunction();
}
function uBlue(val)
{
    $("#Blue").attr("style","height: 30px; width: 60px; background-color:rgb(0,0,"+val+")");
    $("#BValDiv").text(val);
    blue=val;
    updateTransferFunction();
}

function uYellow(val)
{
    $("#Yellow").attr("style","height: 30px; width: 60px; background-color:rgb(128,128,"+val+")");
    $("#YValDiv").text(val);
    Yellow=val;
    updateTransferFunction();
}
function uPink(val)
{
    $("#Pink").attr("style","height: 30px; width: 60px; background-color:rgb(128,"+val+",128)");
    $("#PValDiv").text(val);
    Pink=val;
    updateTransferFunction();
}

function uAlpha(val)
{
   console.log(val);
    $("#aValDiv").text(val);
    alpha=val;
    updateTransferFunction();
}
