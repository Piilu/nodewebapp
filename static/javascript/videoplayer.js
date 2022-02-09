var playtimeout;
function iconpause() {
    clearTimeout(playtimeout)
    let btn = document.getElementById('play-pause');
    let controls = document.getElementById('video-controls')
    btn.classList.remove('fa-play');
    btn.classList.add('fa-pause');
    controls.style.display = 'flex';
    playtimeout = setTimeout(function(){controls.style.display = 'none';video.style.cursor = 'none' }, 3000);

}

function iconplay() {
    let btn = document.getElementById('play-pause');
    let controls = document.getElementById('video-controls')
    controls.style.display = 'flex';
    btn.classList.remove('fa-pause');
    btn.classList.add('fa-play');
}


function volume_change() {
    let slider = document.getElementById('volume-slider');
    let video = document.getElementById('video');
    let volumeicon = document.getElementById('volume_mute');
    video.muted = false;

    if (parseInt(slider.value) < 50 && parseInt(slider.value) > 0 && !video.muted) {
        volumeicon.classList.remove('fa-volume-up')
        volumeicon.classList.add('fa-volume-down')
    }
    else if (parseInt(slider.value) > 50 && !video.muted) {

        volumeicon.classList.remove('fa-volume-down')
        volumeicon.classList.add('fa-volume-up')

    }
    else if (parseInt(slider.value) == 0) {
        volumeicon.classList.remove('fa-volume-down');
        volumeicon.classList.add('fa-volume-off');
    }
    // console.log(video.volume)
    video.volume = slider.value / 100
    // console.log(video.volume)
}
function toggleFullscreen(event) {
    let element = document.getElementById("customplayer");

    if (event instanceof HTMLElement) {
        element = event;
    }

    let isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || false;

    element.requestFullScreen = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || function () { return false; };
    document.cancelFullScreen = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || function () { return false; };

    isFullscreen ? document.cancelFullScreen() : element.requestFullScreen();
}
function fullscreen() {
    toggleFullscreen(event)
}
function videoseek() {
    let video = document.getElementById('video');
    let progress = document.getElementById('video-progressbar');
    let time = video.duration * (progress.value / 100);
    video.currentTime = time
    // console.log(time);


}
function mutevolume() {
    let slider = document.getElementById('volume-slider');
    let video = document.getElementById('video')
    let volumeicon = document.getElementById('volume_mute');
    if (video.muted) {
        if(video.volume > 0.5 ){
            volumeicon.classList.remove('fa-volume-off');
            volumeicon.classList.add('fa-volume-up');
        }
        else if(video.volume < 0.5 && video.volume > 0.01  ){
            volumeicon.classList.remove('fa-volume-off');
            volumeicon.classList.add('fa-volume-down');
        }

        video.muted = false;
        slider.value = video.volume * 100
    }
    else {
        if(volumeicon.classList.contains('fa-volume-up')){
            volumeicon.classList.remove('fa-volume-up');
            volumeicon.classList.add('fa-volume-off');
        }
        else{
            volumeicon.classList.add('fa-volume-off');
            volumeicon.classList.remove('fa-volume-down');
        }
        video.muted = true;
        slider.value = 0;
    }

}


function mouseleaveplayer(){
    let video = document.getElementById('video');
    if(video.paused){
        document.getElementById('video-controls').style.display ='flex'
    }
    else{
        document.getElementById('video-controls').style.display ='none'
    }
}

window.onload = () => {
    
    let video = document.getElementById('video');
    let volumeicon = document.getElementById('volume_mute');
    let slider = document.getElementById('volume-slider');
    let progress = document.getElementById('video-progressbar');
    console.log(video.volume)
    if (video.volume < 0.5 && video.volume > 0.01 && !video.muted) {
        volumeicon.classList.remove('fa-volume-up');
        volumeicon.classList.add('fa-volume-down');

    }
    else if (video.volume == 0) {
        if(volumeicon.classList.contains('fa-volume-up')){
            volumeicon.classList.remove('fa-volume-up')
            volumeicon.classList.add('fa-volume-off');
        }
        else{
            volumeicon.classList.remove('fa-volume-down')
            volumeicon.classList.add('fa-volume-off');
        }
    }


    slider.value = video.volume * 100;

    var source = document.getElementById('source');
    path = localStorage.getItem("moviePath");
    if(path){
        console.log(path);
        source.setAttribute('src', path);
        video.load();
    }
    else{
        alert("No video file found")
    }
    
  

};
document.getElementById('video').addEventListener("loadeddata", (e) => {
    let progress = document.getElementById('video-progressbar');
    let video = document.getElementById('video');
    let totalMin = Math.floor(video.duration / 60);
    let totalSec = Math.floor(video.duration % 60);
    // if seconds are less then 10 then add 0 at the begning
    totalSec < 10 ? totalSec = "0" + totalSec : totalSec;
    document.getElementById('totaltime').innerHTML = totalMin+" : "+totalSec
    progress.value = (100 / video.duration) * video.currentTime;
})

document.getElementById('video').addEventListener("timeupdate", e => {
    let controls = document.getElementById('video-controls')
    let video = document.getElementById('video');
    let progress = document.getElementById('video-progressbar');
    let value = (100 / video.duration) * video.currentTime;
    progress.value = value;

    let currentMin = Math.floor(video.currentTime / 60);
    let currentSec = Math.floor(video.currentTime % 60);
    // if seconds are less then 10 then add 0 at the begning
    currentSec < 10 ? currentSec = "0" + currentSec : currentSec;
    document.getElementById('currenttime').innerHTML =currentMin+" : "+currentSec;

});
var timeout;
document.getElementById('customplayer').addEventListener('mousemove', e => {
    clearTimeout(timeout)
    let controls = document.getElementById('video-controls')
    if(video.paused){
        video.style.cursor = 'default'
        controls.style.display = 'flex'
    }
    else{
        //console.log('tesasdasdasdt')
        controls.style.animation = 'fadein 2s'
        controls.style.display = 'flex'
        video.style.cursor = 'default'
        timeout = setTimeout(function(){controls.style.display = 'none';video.style.cursor = 'none' }, 3000);
    }


});



// Player keyboard shortcuts

document.onkeypress = function (e) {
    e = e || window.event;
    let isFocused = document.activeElement;
    let customplayer = document.getElementById("customplayer");
    if(isFocused ==  customplayer){

        if(e.key=='f' || e.key == 'F'){
            fullscreen();
        }
        else if(e.key == ' '){
           playpause();

        }
        else if(e.key == 'm' ||e.key == 'M'){
            mutevolume();
         }
    }
};
function quickseekfow(){
    let video = document.getElementById('video');
    video.currentTime += 10;
}
function quickseekback(){
    let video = document.getElementById('video');
    video.currentTime -= 10;
}


document.addEventListener('keydown', function(e) {
    let isFocused = document.activeElement;

    if(isFocused ==  customplayer){
    switch (e.keyCode) {
        case 39:
            quickseekfow();
            break;
        case 37:
            quickseekback();
            break;

    }
}
});

//Player keyboard shortcuts END


