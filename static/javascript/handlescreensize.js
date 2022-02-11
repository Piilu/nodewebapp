window.onresize = handlescreensize;
// make screen normal
function handlescreensize() {

    if (window.matchMedia("(min-width: 1160px)").matches) {
        home = document.getElementById("home").style.display = "";
        tools = document.getElementById("tools").style.display = "";
        friends = document.getElementById("friends").style.display = "";
    } 
}