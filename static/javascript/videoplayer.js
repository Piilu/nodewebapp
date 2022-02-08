function iconpause() {
    let btn = document.getElementById('play-pause');
   // let controls = document.getElementById('video-controls')
   // controls.style.display = 'none';
    btn.classList.remove('fa-play');
    btn.classList.add('fa-pause');

}

function iconplay() {
    let btn = document.getElementById('play-pause');
    //let controls = document.getElementById('video-controls')
    //controls.style.display = 'flex';
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
    progress.value = 0;


};


document.getElementById('video').addEventListener("timeupdate", e => {
    let controls = document.getElementById('video-controls')

    let video = document.getElementById('video');
    let progress = document.getElementById('video-progressbar');
    let value = (100 / video.duration) * video.currentTime;
    progress.value = value;
});
var timeout;
document.getElementById('video').addEventListener('mousemove', e => {
    clearTimeout(timeout)
    let controls = document.getElementById('video-controls')
    if(video.paused){
        controls.style.display = 'flex'
    }
    else{
        //console.log('tesasdasdasdt')
        controls.style.display = 'flex'
        timeout = setTimeout(function(){controls.style.display = 'none';}, 3000);
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