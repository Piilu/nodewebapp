var socket = io();

var name = username;//localStorage.getItem("Username");
var room = roomname//localStorage.getItem("roomName");
var userid;
var usersamout;
var roomusers= []
var lastseek = null;



socket.on("sync_on_join_send_test",function(data){
    roomusers = data;
});


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
       
    //}
    //else{
        
     //   console.log("Do not change the host");
   // }
    //document.getElementById("currenthost").innerHTML ="CURRENT HOST: "+localStorage.getItem("host"+room+"");
    //console.log("Room host is "+localStorage.getItem("host"+room+""));
    document.getElementById("tools2").innerHTML="";
    for (let i = 0; i < usersamout; i++) {
        var node = document.createElement("a");
        node.innerHTML = msg[i];
        document.getElementById("tools2").append(node);
    }

});
socket.on("join_room_send_name",function(data){
    if(data.username == roomowner){
       // document.getElementById("makehostbtn").className="buttonvideo";
        node = document.createElement("div");
        node.className="controlsnav"
        node.innerHTML='<button onclick="roomsettingsbtn();" id="videosettingsbtn" class="buttonvideotoprighttradius buttonvideo fa fa-cog"></button>';
        document.getElementById("allvideocontrols").append(node);
    }
})




socket.on("send_disconnect",function(msg){
    if(usersamout ==0){
      
    }    
    document.getElementById("tools2").innerHTML="";
    for (let i = 0; i < usersamout; i++) {
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
    var notify = new Audio('/static/assets/notify.mp3');
    notify.play();
  
    
    var node = document.createElement('p');
    node.innerHTML = "<a style='color: cornsilk;' href ='#'>"+data.username+"</a>"+": "+data.message;
    document.getElementById("chat").append(node)
    updateScroll();
});

socket.on("recive_message_me",function(data){
    var node = document.createElement('p');
    node.innerHTML = "<a style='color: cornsilk;' href ='#'>"+data.username+"</a>"+": "+data.message;
    document.getElementById("chat").append(node)
    updateScroll();
});


socket.on("Playbtn_send",function(data){
    video = document.getElementById("video");
   // console.log('Playbtn_send')
    video.play();
})
socket.on("Pausebtn_send",function(data){
    video = document.getElementById("video");
    video.pause();

})

socket.on("syncUp_send",function(data){
    console.log('ju')
    video = document.getElementById("video");
    //console.log('synced:',data.time )
    lastseek = data.time;
    video.currentTime = data.time;

    



});

socket.on("makehost_send",function(data){
    alert("HOSTE POLE ENAM")
  //  console.log("Host: "+data.username);
   // localStorage.setItem("host"+data.room+"",data.username);
   // document.getElementById("currenthost").innerHTML="CURRENT HOST: "+data.username;

})


socket.on("play_native_send",function(data){
    video = document.getElementById("video");
    //console.log('play_native_send')
    video.play();
})

socket.on("pause_native_send",function(data){
    video = document.getElementById("video");
    video.pause();
})
socket.on("sync_on_join_send",function(data){
    video = document.getElementById("video");
    
    if(data.username==roomusers[0]){
        if(data.paused==false){
            //console.log('sync_on_join_send');
            video.play();
        }
        video.currentTime = data.time;
    }

})



function playpause(){
    if(video.paused){
  //      console.log('play')
        socket.emit("Playbtn",{
            message:"play video",
            room:room,
            username:name,
        })
    }
    else{
   //     console.log('pause')
        socket.emit("Pausebtn",{
            message:"pause video",
            room:room,
            username:name,
        })
    }
}

function syncUp(){
    video = document.getElementById("video");
    timetosync =  video.currentTime;
    if(timetosync != lastseek){

        socket.emit("syncUp",{
            message:"sync",
            room:room,
            username:name,
            time:timetosync,
        })
    }
}

function makehost(){
    socket.emit("makehost",{
        username:name,
        room:room,
        hostchange:1,
    })
}

function playnative(){

        socket.emit("play_native",{
            message:"native pause",
            username:name,
            room:room,
        })
    
}
function pausenative(){
        socket.emit("pause_native",{
            message:"native pause",
            username:name,
            room:room,
        })
    
}
function seeknative(data){
    
        syncUp();

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
