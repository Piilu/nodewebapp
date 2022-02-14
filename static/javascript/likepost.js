
var addlike;
//var alllikedposts = [];
var updatelikes;

socket.on("addlike_send", function (data) {
    //console.log(data)
    addlike = data;
})

//socket.on("all_liked_posts_send", function (data) {
//    alllikedposts = data;
//    console.log("Add liked posts", data)
//})
socket.on("update_likes", function (data) {
    updatelikes = data;
})

socket.on("like_send", function (data) {
   // console.log(data)
    post = document.getElementById(data);
    likenr = document.getElementById(data + "likenr")
    if (post.style.backgroundColor != "rgb(154, 250, 129)") {
        likenr.innerHTML = addlike + " likes";
        post.style.backgroundColor = "rgb(154, 250, 129)";
        post.style.color = "black";
    }

})

socket.on("remove_like_send", function (data) {
    post = document.getElementById(data);
    post.style = null;
    likenr = document.getElementById(data + "likenr")
    likenr.innerHTML = addlike + " likes";
});

socket.on("update_likes_send", function (data) {
    if(document.getElementById(data + "likenr")){

        likenr = document.getElementById(data + "likenr").innerHTML = +updatelikes + " likes";
    }
})

function likebtn(data) {
    var postcreator = document.getElementById(data.id + "username").innerHTML;
    if (data.style.backgroundColor != "rgb(154, 250, 129)") {

        socket.emit("like", {
            username: name,
            button: data.id,
            postmaker: postcreator,
        })
    }
    else {
        socket.emit("remove_like", {
            username: name,
            button: data.id,
            postmaker: postcreator,
        });
    }


}