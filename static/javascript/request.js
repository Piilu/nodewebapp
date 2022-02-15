
socket.on("update_friends_send",function(data){
    if(data !=0){
        fadeIn("You have "+data+" request(s)")

    }

})

socket.on("addfriend_send",function(data){
    fadeIn(data.username+" sent you a friend request");

})
function updateFriends(){
    socket.emit("update_friends",{
        username:name,
    })
}

updateFriends();