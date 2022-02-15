
var mode;
var username = localStorage.getItem("Username");
function menuTab(x) {
    x.classList.toggle("change");
    dropdown();
}

function dropdown() {
    document.getElementById("showitmes").classList.toggle('dropdown-content');
    document.getElementById("showitmes").classList.toggle('dropdownchange');
    document.getElementById("showitmes").classList.toggle('menuvisible');

    // document.getElementById("test").classList.toggle('li');

}


function showsearch() {
    x = document.getElementById("searchlist").style.display = "block"
}

function hidesearch() {

    document.getElementById("searchlist").style.display = "none"

}

function fadeIn(message) {
    node = document.createElement("div")
    node.id = "notification";
    node.style = "margin-top: 5%; display:block; animation: fadeani 1s;";
    node.className = " alertgood"
    node.innerHTML = '<span  class="closebtn" onclick="this.parentElement.style.display=\'none\';">&times;</span><p id ="message">' + message + '</p>';
    $("#notifytest").append(node);
    $(document).ready(function () {
        setTimeout(function () {
            $('#notification').remove();
        }, 3000)

    });

}


function logOut() {
    answer = confirm("Are you sure you want to sign out");

    if (answer == true) {
        window.location.replace("/logout/");


    }
}

function openTools() {
    home = document.getElementById("home").style.display = "none";
    tools = document.getElementById("tools").style.display = "block";
    friends = document.getElementById("friends").style.display = "none";
}

function openHome() {
    home = document.getElementById("home").style.display = "";
    tools = document.getElementById("tools").style.display = "none";
    friends = document.getElementById("friends").style.display = "none";
}

function openFriends() {
    home = document.getElementById("home").style.display = "none";
    tools = document.getElementById("tools").style.display = "none";
    friends = document.getElementById("friends").style.display = "block";
}
function switchmode() {
    mode = document.getElementById("mybody").classList;
    if (mode == "dark-theme") {
        document.getElementById("settingcontent").style.display = "none";
        mode.toggle("light-theme")
        mode.remove("dark-theme")

    }
    else if (mode == "light-theme") {
        document.getElementById("settingcontent").style.display = "none";
        mode.toggle("dark-theme")
        mode.remove("light-theme")


    }
}
function showsettings() {
    if (document.getElementById("mybody").classList == "dark-theme") {
        document.getElementById("modeswitch").innerHTML = "Change to light theme"
    }
    else if (document.getElementById("mybody").classList == "light-theme") {
        document.getElementById("modeswitch").innerHTML = "Change to dark theme"

    }
    var x = document.getElementById("settingcontent");
    if (x.style.display == "none") {
        x.style.display = "block";
    }
    else if (x.style.display == "") {
        x.style.display = "block";


    }
    else {
        x.style.display = "none";
    }
}
function closehamSettings(){
    var x = document.getElementById("settingcontent");
    x.style.display = "none";
}


function openModal() {

    var modal = document.getElementById("createModal");
    var sumbmitbtn = document.getElementById("submitBtn");
    modal.style.display = "block";

    if (sumbmitbtn.disabled = true) {
        sumbmitbtn.style.opacity = "0.5";
        sumbmitbtn.style.backgroundColor = "gray";

    }
}
function openListModal() {

    var modal = document.getElementById("roomList");

    modal.style.display = "block";


}

function closeModal() {
    var span = document.getElementsByClassName("close")[0];
    var modal = document.getElementById("createModal");
    modal.style.display = "none";

}
function closeModalEsc() {
    var modal = document.getElementById("createModal");
    document.addEventListener('keydown', function (event) {
        if (event.key === "Escape") {
            modal.style.display = "none";
        }
    });
}
function closeListModal() {
    var span = document.getElementsByClassName("close")[0];
    var modal = document.getElementById("roomList");
    modal.style.display = "none";

}
function closeListModalEsc() {
    var modal = document.getElementById("roomList");
    document.addEventListener('keydown', function (event) {
        if (event.key === "Escape") {
            modal.style.display = "none";
        }
    });
}

function openListPeopleModal() {
    var modal = document.getElementById("peopleList");

    modal.style.display = "block";
}
function closeListPeopleModal() {
    localStorage.removeItem("selecteduser");

    var span = document.getElementsByClassName("close")[0];
    var modal = document.getElementById("peopleList");
    modal.style.display = "none";
    document.getElementById("seethisusersrooms").style.display = "none";
    document.getElementById("seeallusers").style.display = "block"
}

function closeListPeopleModalEsc() {
    var modal = document.getElementById("peopleList");
    document.addEventListener('keydown', function (event) {
        if (event.key === "Escape") {
            modal.style.display = "none";
            document.getElementById("seethisusersrooms").style.display = "none";
            document.getElementById("seeallusers").style.display = "block"


        }
    });
}



function closeRequestListModal() {
    var span = document.getElementsByClassName("close")[0];
    var modal = document.getElementById("requestList");
    modal.style.display = "none";

}
function closeRequestListModalEsc() {
    var modal = document.getElementById("requestList");
    document.addEventListener('keydown', function (event) {
        if (event.key === "Escape") {
            modal.style.display = "none";
        }
    });
}

function openListFriends() {
    document.getElementById("friendList").style.display = "block"
}
function closeFriends() {
    document.getElementById("seeallfriends").style.display = "block";
    document.getElementById("friendList").style.display = "none";
    document.getElementById("selectedFriend").style.display = "none";

}
function closeFriendsEsc() {
    document.addEventListener('keydown', function (event) {
        if (event.key === "Escape") {
            document.getElementById("seeallfriends").style.display = "block";
            document.getElementById("friendList").style.display = "none";
            document.getElementById("selectedFriend").style.display = "none";
        }
    });

}
function closevideoSettingsModal() {
    document.getElementById("settingsModal").style.display = "none";

}
function closevideoSettingsModalEsc() {
    document.addEventListener('keydown', function (event) {
        if (event.key === "Escape") {
            document.getElementById("settingsModal").style.display = "none";

        }
    });

}

function roomPrivatefunc() {
    publicinfoclose()
    x = document.getElementById("roomPassworddiv").style.display = "block";
    mode = "Private";
    sumbmitbtn = document.getElementById("submitBtn");
    roomname = document.getElementById("roomnameid").value;
    moviename = document.getElementById("movienameid").value;
    password = document.getElementById("roompasswordid").value;
    file = document.getElementById("uploadedName").innerHTML;


    if (roomname.length > 0 && moviename.length > 0 && mode == "Public" && file != "No file choosen") {
        sumbmitbtn.style.opacity = null;
        sumbmitbtn.style.backgroundColor = null;
    }
    else if (roomname.length > 0 && moviename.length > 0 && mode == "Private" && password.length > 0 && file != "No file choosen") {
        sumbmitbtn.style.opacity = null;
        sumbmitbtn.style.backgroundColor = null;
    }
    else {
        sumbmitbtn.style.opacity = "0.5";
        sumbmitbtn.style.backgroundColor = "gray";
    }


}

function roomPublicfunc() {
    publicinfo();
    x = document.getElementById("roomPassworddiv").style.display = "none";
    mode = "Public";
    sumbmitbtn = document.getElementById("submitBtn");
    roomname = document.getElementById("roomnameid").value;
    moviename = document.getElementById("movienameid").value;
    password = document.getElementById("roompasswordid").value;
    file = document.getElementById("uploadedName").innerHTML;

    if (roomname.length > 0 && moviename.length > 0 && mode == "Public" && file != "No file chosen") {
        sumbmitbtn.style.opacity = null;
        sumbmitbtn.style.backgroundColor = null;
        sumbmitbtn.disabled = false;

    }
    else if (roomname.length > 0 && moviename.length > 0 && mode == "Private" && password.length > 0 && file != "No file chosen") {
        sumbmitbtn.style.opacity = null;
        sumbmitbtn.style.backgroundColor = null;
        sumbmitbtn.disabled = false;

    }
    else {
        sumbmitbtn.style.opacity = "0.5";
        sumbmitbtn.style.backgroundColor = "gray";
        sumbmitbtn.disabled = true;
    }
}

function fileName() {
    var fullPath = document.getElementById('movieFile').value;
    var uploadedName = document.getElementById("uploadedName");
    sumbmitbtn = document.getElementById("submitBtn");
    roomname = document.getElementById("roomnameid").value;
    moviename = document.getElementById("movienameid").value;
    password = document.getElementById("roompasswordid").value;
    file = document.getElementById("uploadedName").innerHTML;
    if (fullPath) {
        var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
        var filename = fullPath.substring(startIndex);
        if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
            filename = filename.substring(1);
        }
        uploadedName.innerHTML = filename;

    }

    if (roomname.length > 0 && moviename.length > 0 && mode == "Public" && file != "No file chosen") {
        sumbmitbtn.style.opacity = null;
        sumbmitbtn.style.backgroundColor = null;
        sumbmitbtn.disabled = false;

    }
    else if (roomname.length > 0 && moviename.length > 0 && mode == "Private" && password.length > 0 && file != "No file chosen") {
        sumbmitbtn.style.opacity = null;
        sumbmitbtn.style.backgroundColor = null;
        sumbmitbtn.disabled = false;

    }
    else {
        sumbmitbtn.style.opacity = "0.5";
        sumbmitbtn.style.backgroundColor = "gray";
        sumbmitbtn.disabled = true;


    }
}

function avoidEnter() {
    $(document).keypress(
        function (event) {
            if (event.which == '13') {
                event.preventDefault();
            }
        });
}


function checkRoomname() {
    sumbmitbtn = document.getElementById("submitBtn");
    roomname = document.getElementById("roomnameid").value;
    moviename = document.getElementById("movienameid").value;
    password = document.getElementById("roompasswordid").value;
    file = document.getElementById("uploadedName").innerHTML;
    if (roomname.length > 0 && moviename.length > 0 && mode == "Public" && file != "No file choosen") {
        sumbmitbtn.style.opacity = null;
        sumbmitbtn.style.backgroundColor = null;
        sumbmitbtn.disabled = false;

    }
    else if (roomname.length > 0 && moviename.length > 0 && mode == "Private" && password.length > 0 && file != "No file choosen") {
        sumbmitbtn.style.opacity = null;
        sumbmitbtn.style.backgroundColor = null;
        sumbmitbtn.disabled = false;

    }
    else {
        sumbmitbtn.style.opacity = "0.5";
        sumbmitbtn.style.backgroundColor = "gray";
        sumbmitbtn.disabled = true;


    }
}

function checkMoviename() {


    sumbmitbtn = document.getElementById("submitBtn");
    roomname = document.getElementById("roomnameid").value;
    moviename = document.getElementById("movienameid").value;
    password = document.getElementById("roompasswordid").value;
    file = document.getElementById("uploadedName").innerHTML;



    if (roomname.length > 0 && moviename.length > 0 && mode == "Public" && file != "No file choosen") {
        sumbmitbtn.style.opacity = null;
        sumbmitbtn.style.backgroundColor = null;
        sumbmitbtn.disabled = false;

    }
    else if (roomname.length > 0 && moviename.length > 0 && mode == "Private" && password.length > 0 && file != "No file choosen") {
        sumbmitbtn.style.opacity = null;
        sumbmitbtn.style.backgroundColor = null;
        sumbmitbtn.disabled = false;

    }
    else {
        sumbmitbtn.style.opacity = "0.5";
        sumbmitbtn.style.backgroundColor = "gray";
        sumbmitbtn.disabled = true;


    }
}


function checkPassword() {
    sumbmitbtn = document.getElementById("submitBtn");
    roomname = document.getElementById("roomnameid").value;
    moviename = document.getElementById("movienameid").value;
    password = document.getElementById("roompasswordid").value;
    file = document.getElementById("uploadedName").innerHTML;


    if (roomname.length > 0 && moviename.length > 0 && mode == "Public" && file != "No file choosen") {
        sumbmitbtn.style.opacity = null;
        sumbmitbtn.style.backgroundColor = null;
        sumbmitbtn.disabled = false;

    }
    else if (roomname.length > 0 && moviename.length > 0 && mode == "Private" && password.length > 0 && file != "No file choosen") {
        sumbmitbtn.style.opacity = null;
        sumbmitbtn.style.backgroundColor = null;
        sumbmitbtn.disabled = false;

    }
    else {
        sumbmitbtn.style.opacity = "0.5";
        sumbmitbtn.style.backgroundColor = "gray";
        sumbmitbtn.disabled = true;


    }
}

function finalcheck() {
    sumbmitbtn = document.getElementById("submitBtn");
    roomname = document.getElementById("roomnameid").value;
    moviename = document.getElementById("movienameid").value;
    password = document.getElementById("roompasswordid").value;
    file = document.getElementById("uploadedName").innerHTML;
    if (roomname.length > 0 && moviename.length > 0 && mode == "Public" && file != "No file chosen") {
        sumbmitbtn.style.opacity = null;
        sumbmitbtn.style.backgroundColor = null;
        sumbmitbtn.disabled = false;
    }
    else if (roomname.length > 0 && moviename.length > 0 && mode == "Private" && password.length > 0 && file != "No file chosen") {
        sumbmitbtn.style.opacity = null;
        sumbmitbtn.style.backgroundColor = null;
        sumbmitbtn.disabled = false;

    }
    else {
        sumbmitbtn.style.opacity = "0.5";
        sumbmitbtn.style.backgroundColor = "gray";
        sumbmitbtn.disabled = true;


    }
}


function creatPath() {
    file = document.getElementById("uploadedName").innerHTML;
    moviename = document.getElementById("movienameid").value;
    path = "http://192.168.1.141:3000/" + "/uploads/" + username + "/" + mode + "/" + moviename + "/" + file;
    localStorage.setItem("moviePath", path);
    console.log(path);
}

function closeModalPassword() {
    location.replace('/');
}
function findpeopleModalBackbtn() {
    document.getElementById("seethisusersrooms").style.display = "none";
    document.getElementById("seeallusers").style.display = "block";
    localStorage.removeItem("selecteduser");


}
function friendsBackBtn() {
    document.getElementById("selectedFriend").style.display = "none";
    document.getElementById("seeallfriends").style.display = "block";
    localStorage.removeItem("selecteduser");
}


//Will be moved to socketio.js and connected into database
function commentbtn(data) {
    comments = document.getElementById(data.id + "postcommentssec");
    if (comments.style.display == "none") {
        comments.style.animation = 'fadein 0.5s'
        comments.style.display = "block";

    }
    else {
        comments.style.display = "none";

    }
}

function fullscreenvideo() {
    var elem = document.getElementById("video");
    document.addEventListener('keydown', function (event) {
        if (event.key === "f") {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) { /* Safari */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE11 */
                elem.msRequestFullscreen();
            }
        }
    });
}
function roomsettingsbtn() {
    modal = document.getElementById("settingsModal");
    modal.style.display = "block"

}

function publicinfo() {
    document.getElementById('publicinfo').style.display = 'block'
    document.getElementById('publicinfo').innerHTML = 'NOTE! Your file will be used by others'
}
function publicinfoclose() {
    document.getElementById('publicinfo').style.display = 'none'

}
