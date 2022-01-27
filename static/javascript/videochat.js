var socket = io();
var name = localStorage.getItem("Username");
var room = localStorage.getItem("roomName");
var userid;
var usersamout;



 


function updateScroll(){
    var element = document.getElementById("chat");
    element.scrollTop = element.scrollHeight;
}
socket.emit("join",{
    username:name,
})
socket.emit('join room', {
       
    username: name,
    room: room,
    status:room,
});

socket.emit('disconnect', {
    username: name,
    room: room,
});


socket.on('join_room_send', function(msg){
    synconjoin();
    //if(msg.length==1){
    localStorage.setItem("host"+room+"",msg[0]);
       
    //}
    //else{
        
     //   console.log("Do not change the host");
   // }
    document.getElementById("currenthost").innerHTML ="CURRENT HOST: "+localStorage.getItem("host"+room+"");
    console.log("Room host is "+localStorage.getItem("host"+room+""));
    document.getElementById("tools2").innerHTML="";
    for (let i = 0; i < usersamout; i++) {
        var node = document.createElement("a");
        node.innerHTML = msg[i];
        document.getElementById("tools2").append(node);
    }

});
socket.on("join_room_send_name",function(data){
    if(data.username == localStorage.getItem("roomOwner")){
        document.getElementById("makehostbtn").className="buttonvideo";
        node = document.createElement("div");
        node.className="controlsnav"
        node.innerHTML='<button onclick="roomsettingsbtn();" id="videosettingsbtn" class="buttonvideotoprighttradius buttonvideo fa fa-cog"></button>';
        document.getElementById("allvideocontrols").append(node);
    }
})




socket.on("send_disconnect",function(msg){
    if(usersamout ==0){
        localStorage.removeItem("host"+room+"");
    }    
    document.getElementById("tools2").innerHTML="";
    for (let i = 0; i < usersamout; i++) {
        if(msg[i]==localStorage.getItem("host"+room+"")){
            console.log("host on veel alles")
        }
        else{
            localStorage.setItem("host"+room+"",msg[0]);
            document.getElementById("currenthost").innerHTML ="CURRENT HOST: "+localStorage.getItem("host"+room+"");
        }
        var node = document.createElement("a");
        node.innerHTML = msg[i];
        document.getElementById("tools2").append(node);
    }

});

socket.on("count",function(msg){
    //console.log("Users: "+msg);
    usersamout = msg;

});

socket.on("userid",function(id){
    userid=id;
   // document.getElementById("showuserid").innerHTML="UserID: "+id;
});

function chatEnter(){
    

    $(document).keypress(
        function(event){
          if (event.which == '13') {
                 event.preventDefault();
                 let message_input = document.getElementById('sendChat');
                 let message = message_input.value.trim();
              if (message.length){
                socket.emit("send_message",{
                    username: name,
                    room: room,
                    message: message,
            
                });
                document.getElementById("sendChat").value = "";
            }

            
          }
      });

    //document.getElementById("sendChat").value = "";
}

socket.on("recive_message",function(data){
    var node = document.createElement('p');
    node.innerHTML = "<a style='color: cornsilk;' href ='#'>"+data.username+"</a>"+": "+data.message;
    document.getElementById("chat").append(node)
    updateScroll();
});



socket.on("Playbtn_send",function(data){
    video = document.getElementById("video");
    video.play();
})
socket.on("Pausebtn_send",function(data){
    video = document.getElementById("video");
    video.pause();

})

socket.on("syncUp_send",function(data){
    video = document.getElementById("video");
    video.currentTime = data.time;

});

socket.on("makehost_send",function(data){
    console.log("Host: "+data.username);
    localStorage.setItem("host"+data.room+"",data.username);
    document.getElementById("currenthost").innerHTML="CURRENT HOST: "+data.username;

})


socket.on("play_native_send",function(data){
    video = document.getElementById("video");
    video.play();
})

socket.on("pause_native_send",function(data){
    video = document.getElementById("video");
    video.pause();
})

socket.on("sync_on_join_send",function(data){
    video = document.getElementById("video");

    if(data.username==localStorage.getItem("host"+room+"")){
        if(data.paused==false){
            video.play();
        }
        video.currentTime = data.time;
    }

})



function playpause(){
    if(video.paused){
        socket.emit("Playbtn",{
            message:"play video",
            room:room,
            username:name,
        })
    }
    else{
        socket.emit("Pausebtn",{
            message:"pause video",
            room:room,
            username:name,
        })
    }
}

function syncUp(){
    video = document.getElementById("video");
    timetosync = video.currentTime;
    socket.emit("syncUp",{
        message:"sync",
        room:room,
        username:name,
        time:timetosync,
    })
}

function makehost(){
    socket.emit("makehost",{
        username:name,
        room:room,
        hostchange:1,
    })
}

function playnative(){
    if(localStorage.getItem("host"+room+"")==name){

        socket.emit("play_native",{
            message:"native pause",
            username:name,
            room:room,
        })
    }
    
}
function pausenative(){
    if(localStorage.getItem("host"+room+"")==name){
        socket.emit("pause_native",{
            message:"native pause",
            username:name,
            room:room,
        })
    }
    
}
function seeknative(data){
    if(localStorage.getItem("host"+room+"")==name){

        syncUp();
    }
    
}

function synconjoin(){
    video = document.getElementById("video");
    checkpause = video.paused;
    timetosync = video.currentTime;
    socket.emit("sync_on_join",{
        username:name,
        room:room,
        time:timetosync,
        paused:checkpause,
    })
}
function fadeIn(message){  
    node = document.createElement("div")
    node.id="notification";
    node.style="margin-top: 5%; display:block; animation: fadeani 1s;";
    node.className =" alertgood"
    node.innerHTML='<span  class="closebtn" onclick="this.parentElement.style.display=\'none\';">&times;</span><p id ="message">'+message+'</p>';
  $("#notifytest").append(node);
  $(document).ready(function () {
 setTimeout(function() {
     $('#notification').remove();
    }, 3000)   
    
 });
 
 }