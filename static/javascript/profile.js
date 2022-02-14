var socket = io();
var name = username
//var addlike;
//var alllikes =[];
var alllikedposts = [];
//var updatelikes;

//socket.on("addlike_send", function (data) {
//    console.log(data)
//    addlike = data;
//})

socket.on("all_liked_posts_send_profile", function (data) {
    loadactivity();
    alllikedposts = data;
   // console.log("Add liked posts", data)
})
//socket.on("update_likes", function (data) {
//    updatelikes = data;
//})
socket.emit('join_profile', {
    username: name,
});

//socket.on("remove_like_send", function (data) {
//    post = document.getElementById(data);
//    post.style = null;
//    likenr = document.getElementById(data + "likenr")
//    likenr.innerHTML = addlike + " likes";
//});

//socket.on("update_likes_send", function (data) {
//    likenr = document.getElementById(data + "likenr").innerHTML = +updatelikes + " likes";
//})


socket.on('send_profile_data', function (data) {
    console.log(alllikedposts)
    if (data.length == 0) {
        document.getElementById("profilepoststitle").style.display = "block"
    }
    else {
        data.reverse()
        document.getElementById("profilepoststitle").style.display = "none"

        for (let i = 0; i < data.length; i++) {
            var profilepost = document.createElement("div");
            profilepost.id = data.PostID
            profilepost.className = "postdiv"
            profilepost.innerHTML = '<div style="text-align: left; animation: fadein 1s;"class="postborder maincontainer"><a id="' + data[i].PostID + "username" + '" class="postName maincontainer"href="#">' + data[i].Username + '</a><div class="limit maincontainer"style="line-height: 2;"><p style="white-space:pre-wrap;" class="maincontainer">' + data[i].Post + '</p></div><div style="width: 90%;" class="postline maincontainer"><p id="' + data[i].PostID + "likenr" + '">' + data[i].Likes + ' likes</p></div><div class="postfooter"><div><button onclick="likebtn(this);" id="' + data[i].PostID + '" class="btnposts fa fa-thumbs-o-up">LIKE</button></div><div><button onclick="commentbtn(this);" id="' + data[i].PostID + '"class="btnposts fa fa-comment-o">COMMENT</button></div></div><div id="' + data[i].PostID + "postcommentssec" + '" style="display: none"><input class="commentinput" type="text" name="" id="" placeholder="Not available" disabled></div></div>'
            document.getElementById("profile-posts").append(profilepost);
            for (let a = 0; a < alllikedposts.length; a++) {
                if (alllikedposts[a] == data[i].PostID) {
                    document.getElementById(alllikedposts[a]).style.backgroundColor = "rgb(154, 250, 129)";
                    document.getElementById(alllikedposts[a]).style.color = "black";
                }
    
            }
        }
    }
})







//socket.on("like_send", function (data) {
//    console.log(data)
//    post = document.getElementById(data);
//    likenr = document.getElementById(data + "likenr")
//    if (post.style.backgroundColor != "rgb(154, 250, 129)") {
//        likenr.innerHTML = addlike + " likes";
//        post.style.backgroundColor = "rgb(154, 250, 129)";
//        post.style.color = "black";
//    }
//
//})



//function likebtn(data) {
//    var postcreator = document.getElementById(data.id + "username").innerHTML;
//    if (data.style.backgroundColor != "rgb(154, 250, 129)") {
//
//        socket.emit("like", {
//            username: name,
//            button: data.id,
//            postmaker: postcreator,
//        })
//    }
//    else {
//        socket.emit("remove_like", {
//            username: name,
//            button: data.id,
//            postmaker: postcreator,
//        });
//    }
//
//
//}

function showposts() {
    var posttab = document.getElementById('profile-posts');
    var tab = document.getElementById('tab2');
    posttab.style.display = 'block'
    tab.style.display = 'none'

}


function showtab() {
    var posttab = document.getElementById('profile-posts')

    var tab = document.getElementById('tab2');
    tab.style.display = "block"
    posttab.style.display = "none"

}