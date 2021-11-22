var socket = io();
var name = localStorage.getItem("Username");
var roomlistlenght;
var roommode = [];
var alluserslenght;
var thisusername;
var thisuserroomslenght;
var thisfriendroomslenght;
var thisuserroommode =[];
var thisfriendroommode =[];
var allfriends;
var requestlength;
var allposts = [];
var allpostsusernames = [];
var allpostsids=[];
var thispostid;
var addlike;
var alllikes =[];
var alllikedposts=[];
var updatelikes;
var scrollLock = false;
var lastload = 0;


//loading.display.style = "none";
window.onscroll= function(){
    if(scrollLock) return;
    if(this.innerHeight + this.pageYOffset >= document.body.scrollHeight){
        scrollLock = true;
        let postLength= document.querySelectorAll(".postborder").length;
        console.log(postLength);
        document.getElementById("loadingmore").style.display="block";
        console.log("loading");
        setTimeout(function(){
            
            loadposts(postLength);
          
        },1500);

    }
}
///ALL SOCKETIO LISTENERS 
socket.emit("join",{
    username:name,
    
})
//////////////////////////////////////////////
socket.on("update_roomlist_mode",function(data){
    roommode = data;
});
socket.on("get_this_user_roommode",function(data){
    thisuserroommode=data;
})
socket.on("update_roomlist_lenght",function(data){
    roomlistlenght = data;
});
socket.on("get_all_users_lenght",function(data){
    alluserslenght = data;
});
socket.on("get_this_user_rooms_lenght",function(data){
    thisuserroomslenght = data;
})
socket.on("get_this_friend_rooms_lenght",function(data){
    thisfriendroomslenght = data;
})
socket.on("get_this_friend_roommode",function(data){
    thisfriendroommode=data;
})
socket.on("get_requests_lenght",function(data){
    requestlength = data;
})

socket.on("load_posts_send_posts",function(data){
    allposts = data;
})
socket.on("all_posts_ids",function(data){
    allpostsids = data;
})
socket.on("this_post_id",function(data){
    thispostid =data;
})
socket.on("addlike_send",function(data){
    addlike = data;
})
socket.on("load_likes_send",function(data){
    alllikes = data;
})
socket.on("all_liked_posts_send",function(data){
    alllikedposts=data;
})
socket.on("update_likes",function(data){
    updatelikes = data;
})
//////////////////////////////////////////////

//GETS ALL LOGGED USER ROOMS
socket.on("update_roomlist_send",function(data){
    if(roomlistlenght !=0){

        document.getElementById("listofrooms").innerHTML="";
        data.reverse();
        roommode.reverse();
    }
    for (let i = 0; i < roomlistlenght; i++) {
        var node = document.createElement("a");
        if(roommode[i]=="Public"){

            node.innerHTML = data[i]+"<br> <p class='watchingstatus'>"+roommode[i]+"</p>";
        }
        else if (roommode[i]=="Private"){
            node.innerHTML = data[i]+"<br> <p style='color:red' class='watchingstatus'>"+roommode[i]+"</p>";
        }

        node.href ="/"+name+"/movieroom/"+data[i]+"";
        document.getElementById("listofrooms").append(node);
    }
})
//SHOWS HOW MANY REQUEST USER HAS (WHEN LOGGED IN OR REFRESHED)
socket.on("update_friends_send",function(data){
    loadactivity();
    loadposts();
    if(data !=0){
        fadeIn("You have "+data+" request(s)")
    }
})
//SHOWS WHEN SOMEONE SENDS YOU A FRIEND REQUEST
socket.on("addfriend_send",function(data){
    updaterequests();
    fadeIn(data.username+" sent you a friend request");

})
//RENDERS ALL REQUESTS IN REQUEST TAB SO USER CAN ACCEPT OR DECLINE IT 
socket.on("addfriend_send_update",function(data){
    if(requestlength!=0){
        document.getElementById("listofrequests").innerHTML ="";
    }
    else{
        document.getElementById("listofrequests").innerHTML='<p style="text-align: center; opacity: 0.5;">You have 0 requests</p>';
    }
    for (let i = 0; i <requestlength ; i++) {
        node = document.createElement("div");
        node.id ="friendrequest"+data[i];    
        node.innerHTML = ' <h1 class="addfriendListp">'+data[i]+'</h1><button onclick ="friendrequestDecline(\'' + data[i] + '\')" class="redbtn">Decline</button><button  onclick="friendrequestAccept(\'' + data[i] + '\')" class="greenbtn">Accept</button>'
        document.getElementById("listofrequests").append(node);

    }
})

//WHEN FRIEND REQUEST FAILS TO SEND
socket.on("addfriend_send_failed",function(data){
    console.log("Request Failed");
})

//SHOWS ALL USERS AND HANDLES USER CLICK
socket.on("get_all_users_send",function(data){
    if(alluserslenght-1 !=0){

        document.getElementById("listofpeople").innerHTML="";
        data.reverse();
    }
    for (let i = 0; i < alluserslenght-1; i++) {
        var node = document.createElement("button");

        node.className = "btn2";
        node.innerHTML = data[i];
        node.onclick =function () {
            document.getElementById("seeallusers").style.display = "none";
            document.getElementById("seethisusersrooms").style.display = "block";
            document.getElementById("seethisuserroomstitle").innerHTML = this.innerHTML+"'s rooms";
            thisusername= this.innerHTML;
            localStorage.setItem("selecteduser",thisusername);
            checkrequests();
            getthisuserrooms();

           

        };

        document.getElementById("listofpeople").append(node);
    }
})

//SHOWS ALL SPECIFIC USER ROOMS 
socket.on("get_this_user_rooms_send",function(data){

    if(thisuserroomslenght !=0){

        document.getElementById("listofthisuserrooms").innerHTML="";
        data.reverse();
        thisuserroommode.reverse();
    }
    else{
       document.getElementById("listofthisuserrooms").innerHTML='<p id="otheruserrooms" style="text-align: center; opacity: 0.5;">This user has 0 rooms</p>';
    }
    for (let i = 0; i < thisuserroomslenght; i++) {
        var node = document.createElement("a");
        if(thisuserroommode[i]=="Public"){
            node.innerHTML = data[i]+"<br> <p class='watchingstatus'>"+thisuserroommode[i]+"</p>";
        }
        else if (thisuserroommode[i]=="Private"){
            node.innerHTML = data[i]+"<br> <p style='color:red' class='watchingstatus'>"+thisuserroommode[i]+"</p>";
        }

        node.href ="/"+thisusername+"/movieroom/"+data[i]+"";
        document.getElementById("listofthisuserrooms").append(node);
    }
});

//SHOWS ALL FRIEND ROOMS
socket.on("get_this_friend_rooms_send",function(data){

    if(thisfriendroomslenght !=0){

        document.getElementById("listofthisfriendrooms").innerHTML="";
        data.reverse();
        thisfriendroommode.reverse();
    }
    else{
        document.getElementById("listofthisfriendrooms").innerHTML='<p id="otheruserrooms" style="text-align: center; opacity: 0.5;">This user has 0 rooms</p>';
    }
    for (let i = 0; i < thisfriendroomslenght; i++) {
        var node = document.createElement("a");
        if(thisfriendroommode[i]=="Public"){
            node.innerHTML = data[i]+"<br> <p class='watchingstatus'>"+thisfriendroommode[i]+"</p>";
        }
        else if (thisfriendroommode[i]=="Private"){
            node.innerHTML = data[i]+"<br> <p style='color:red' class='watchingstatus'>"+thisfriendroommode[i]+"</p>";
        }

        node.href ="/movieroom/"+data[i]+"";
        document.getElementById("listofthisfriendrooms").append(node);
    }
});

//RENDERS THE "ADD FRIEND BUTTON"
socket.on("addfriend_send_show",function(data){
    btn = document.getElementById("addtofriendsbtn"+data.friendname+"");
    btn.disabled = "true";
    btn.innerHTML="Request sent";
    btn.style.backgroundColor = "gray";
    btn.style.cursor = "default";

    
});

//RENDERS THE "ADD FRIEND BUTTON"
socket.on("check_requests_send",function(data){
    document.getElementById("addfriendbtndiv").innerHTML='<button id="addtofriendsbtn'+data.friendname+'"  onclick="addfriend();" class="addtofriends">Add to friends</button>';
})
socket.on("check_requests_sent",function(data){
    document.getElementById("addfriendbtndiv").innerHTML='<button id="addtofriendsbtn'+data.friendname+'"  onclick="addfriend();" class="addtofriends">Add to friends</button>';
    btn = document.getElementById("addtofriendsbtn"+data.friendname+"");
    btn.disabled = "true";
    btn.innerHTML="Request sent";
    btn.style.backgroundColor = "gray";
    btn.style.cursor = "default";
})

//RENDERS THE "ADD FRIEND BUTTON"
socket.on("check_requests_sent_2",function(data){
    document.getElementById("addfriendbtndiv").innerHTML='<button id="addtofriendsbtn'+data.friendname+'"  onclick="addfriend();" class="addtofriends">Add to friends</button>';
    btn = document.getElementById("addtofriendsbtn"+data.friendname+"");
    btn.disabled = "true";
    btn.innerHTML="Your friend";
    btn.style.backgroundColor = "rgb(189, 255, 219)";
    btn.style.cursor = "default";

    
});

//DELETES THE REQUEST WHEN USER HAS CLICCKED ACCEPT
socket.on("accept_request_send",function(data){
    loadactivity();
    //loadposts();
    document.getElementById("friendrequest"+data.friendname).remove();
    //console.log(data.username + " and "+ data.friendname+" are now friends");
});
//RENDERS THE "YOUR FRIEND" DISABLED BUTTON
socket.on("accept_request_send_notify",function(data){
    loadactivity();
    loadposts();
    document.getElementById("addfriendbtndiv").innerHTML='<button id="addtofriendsbtn'+data.friendname+'"  onclick="addfriend();" class="addtofriends">Add to friends</button>';
    btn = document.getElementById("addtofriendsbtn"+data.friendname+"");
    btn.disabled = "true";
    btn.innerHTML="Your friend";
    btn.style.backgroundColor = "rgb(189, 255, 219)";
    btn.style.cursor = "default";
    fadeIn(data.username+" accepted your friend request");
    location.reload(); //temporary
});
//DELETES THE REQUEST WHEN USER HAS CLICCKED DECLINE
socket.on("decline_request_send",function(data){
    document.getElementById("friendrequest"+data.friendname).remove();
    console.log(data.username+" declined "+data.friendname+" request");
    
});
//LETS USER KNOW THAT THE OTHER USER DECLINED YOUR FRIEND REQUEST
socket.on("decline_request_notify",function(data){
    document.getElementById("addfriendbtndiv").innerHTML='<button id="addtofriendsbtn'+data.friendname+'"  onclick="addfriend();" class="addtofriends">Add to friends</button>';
    fadeIn(data.username+" declined your friend request");
});
//GETS THE NUMBER OF USERS
socket.on("get_all_friends_lenght",function(data){
    allfriends = data;
});

//RENDERS ALL USERS FRIENDS AND HANDLES THE CLICK
socket.on("get_all_friends_send",function(data){
    if(allfriends !=0){
        document.getElementById("listoffriends").innerHTML ="";
    };

    for (let i = 0; i < allfriends; i++) {
        var node = document.createElement("button");

        node.className = "btn2";
        node.innerHTML = data[i];
        node.onclick =function () {
            document.getElementById("seeallfriends").style.display = "none";
            document.getElementById("selectedFriend").style.display = "block";
            document.getElementById("seethisfriendroomstitle").innerHTML = this.innerHTML+"'s rooms";
            thisusername= this.innerHTML;
            localStorage.setItem("selecteduser",thisusername);
            getthisfriendrooms();

           

        };

        document.getElementById("listoffriends").append(node);
       
    }
});


//HANDELS ALL POSTS IN HOME PAGE
socket.on("make_post_send",function(data){
    if(allpostsids.length+1 ==10){
        document.getElementById("loadmorebtnid").style.display="block";
    }

    var title =document.getElementById("poststitle");
    if(title.style.display!="none"){
        title.style.display="none";
    }
    post = document.getElementById("posts");
    node = document.createElement("div");
    node.className ="postdiv border2";
    node.style="animation: fadeani 0.5s;"
    node.innerHTML ='<div style="animation: fadein 1s;" class="postborder maincontainer"><a id="'+thispostid+"username"+'" class="postName maincontainer" href="#">'+data.username+'</a><div class="maincontainer" style=" margin-bottom: 5%;"><div class="limit maincontainer" style="line-height: 2;"><p class="maincontainer">'+data.message+'</p></div></div><div style="width: 90%;" class="postline maincontainer"><p id = "'+thispostid+"likenr"+'">0 likes</p></div><div  class="postfooter"> <div><button onclick="likebtn(this);"id="'+thispostid+'" class="btnposts fa fa-thumbs-o-up"> LIKE</button></div><div><button onclick="commentbtn(this);" id="'+thispostid+'" class="btnposts fa fa-thumbs-o-up"> COMMENT</button></div></div><div style="display: none"><input class="commentinput" type="text" name="" id="" placeholder="Comment ..."></div></div>'
    document.getElementById("posts").insertBefore(node,post.firstChild);
})

//GETTING POSTS IN DATABASE
socket.on("load_posts_send",function(data){
    //if strting to make loadmorebtn so posts will be rendered in correct order.
  //  allposts.reverse();
   // data.reverse();
   // allpostsids.reverse();
   // alllikes.reverse();
    //////////////////////
    //if(allpostsids.length >=10){
      //  document.getElementById("loadmorebtnid").style.display="none";
    //}

    if(data.length !=0  ||  lastload == 1){
        document.getElementById("poststitle").style.display="none"
    }
   // else if(data.length>=10){
      //  document.getElementById("loadmorebtnid").style.display="block"   
    //}
    //else if(data.length<=10){
     //   document.getElementById("loadmorebtnid").style.display="none"   
    //}
    else{
        document.getElementById("poststitle").style.display="block"
    }
    for (let i = 0; i < data.length; i++) {
        post = document.getElementById("posts");
        node = document.createElement("div");
        node.className ="postdiv border2";
        node.style="animation: fadeani 0.75s;"
        

        node.innerHTML ='<div style="animation: fadein 1s;" class="postborder maincontainer"><a id="'+allpostsids[i]+"username"+'" class="postName maincontainer" href="#">'+data[i]+'</a><div class="limit maincontainer" style="line-height: 2;"><p class="maincontainer">'+allposts[i]+'</p></div><div style="width: 90%;" class="postline maincontainer"><p id="'+allpostsids[i]+"likenr"+'">'+alllikes[i]+' likes</p></div><div  class="postfooter"> <div><button onclick="likebtn(this);"id="'+allpostsids[i]+'" class="btnposts fa fa-thumbs-o-up"> LIKE</button></div><div><button onclick="commentbtn(this);" id="'+allpostsids[i]+'" class="btnposts fa fa-comment-o">COMMENT</button></div></div><div id="'+allpostsids[i]+"postcommentssec"+'" style="display: none"><input class="commentinput" type="text" name="" id="" placeholder="Comment ..."></div> </div>'
        

        document.getElementById("posts").append(node);//insertBefore(node,post.firstChild);   //.append(node);<-- is also for loadmore btn so it will be in correct order
        for(let a = 0;a<alllikedposts.length;a++){
            if(alllikedposts[a]==allpostsids[i]){
                document.getElementById(alllikedposts[a]).style.backgroundColor ="rgb(154, 250, 129)";
                document.getElementById(alllikedposts[a]).style.color ="black";
            }
          
    }

    }
    if(data.length != 0){
        //document.getElementById("loadingmore").style.display="none";
        lastload = 1;
        scrollLock = false;
    }
    else{
        scrollLock = true;
        lastload = 0;
      //  document.getElementById("poststitle").style.display="none"

        document.getElementById("loadingmore").style.display="none";

    }

})


socket.on("like_send",function(data){
    post = document.getElementById(data);
    likenr = document.getElementById(data+"likenr")
    if(post.style.backgroundColor!="rgb(154, 250, 129)"){
        likenr.innerHTML=addlike+" likes";
        post.style.backgroundColor="rgb(154, 250, 129)";
        post.style.color="black";
    }

})

socket.on("remove_like_send",function(data){
    post = document.getElementById(data);
    post.style=null;
    likenr = document.getElementById(data+"likenr")
    likenr.innerHTML=addlike+" likes";
});

socket.on("update_likes_send",function(data){
    likenr = document.getElementById(data+"likenr").innerHTML=+updatelikes+" likes";
})

//only refreshes when main page is loaded
socket.on("load_friends_to_activity_send",function(data){
    if(data.length!=0){
        document.getElementById("activitydiv").innerHTML="";
    }
    else{
      
      document.getElementById("activitydiv").innerHTML='<p style="text-align: center; color: gainsboro; opacity: 0.2;">NO ACTIVITY</p>';
    }
    for(let i = 0;i<data.length;i++){
        node = document.createElement("div");
        node.className = "statusitem";
        node.style = 'transition:0.3s; animation: fadein 0.5s';
        node.id=data[i]+"activity";
        node.innerHTML ='<a  href="">'+data[i]+'<br><p class="watchingstatus">Watching <i id="'+data[i]+"activitystatus"+'">Movie name</i></p></a>'
        document.getElementById("activitydiv").append(node);
    }
})
//hetkel saadetakse see koikidele kasutajatele kui keegi joinib roomi
socket.on("change_activity_send",function(data){
    loadactivity();
})



///ALL SOCKET IO EMITS
function updateFriends(){
    socket.emit("update_friends",{
        username:name,
    })
}
function getallusers(){
    socket.emit("get_all_users",{
        username:name,

    });
}
function getthisuserrooms(){
    socket.emit("get_this_user_rooms",{
        username:thisusername,
    })


}
function getthisfriendrooms(){
    socket.emit("get_this_friend_rooms",{
        username:thisusername,
    })
}


function addfriend(){
    newfriend = localStorage.getItem("selecteduser"),
    //console.log(newfriend);

    socket.emit("addfriend",{
        username:name,
        friendname:newfriend,
    })
}

function friendrequestAccept(data){
    console.log("Accepted request from "+data)
    //document.getElementById("friendrequest"+data).remove();
    socket.emit("accept_request",{
        username:name,
        friendname:data,
    })
}
function friendrequestDecline(data){
    //console.log("Declined request from "+data);
    //document.getElementById("friendrequest"+data).remove();
    socket.emit("decline_request",{
        username:name,
        friendname:data,
    })

}

function checkrequests(){
    thisusername2 = localStorage.getItem("selecteduser");
    console.log("Checking requests");
    socket.emit("check_requests",{
        username:name,
        friendname:thisusername2,
    })
}

function getallfriends(){
    socket.emit("get_all_friends",{
        username:name,
    })
}

function updaterequests(){
    socket.emit("request_update",{
        username:name,
    });
}

function openFrienRequestModal(){
    showsettings();
    var modal = document.getElementById("requestList");
    modal.style.display = "block";
    updaterequests();

}

function updateRoomlist(){
    socket.emit("update_roomlist",{
        username:name,
        
    });
}

function makepost(){
    let message_input = document.getElementById('postsend');
    let message = message_input.value.trim();
    if (message.length){
        socket.emit("make_post",{
            message:message,
            username:name,
        })
         document.getElementById("postsend").value = "";
    }
}
function postunfocus(){
    document.addEventListener('keydown', function(event){
        if(event.key === "Escape"){
            document.getElementById("postsend").blur();
        }
    });
}

function loadposts(loadmorepost){

    allposts = [];
    allpostsids = [];
    if(!loadmorepost){
        loadmorepost=0;
    }
    socket.emit("load_posts",{
        username:name,
        offset:loadmorepost,
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
 function likebtn(data){
    var postcreator = document.getElementById(data.id+"username").innerHTML; 
    if(data.style.backgroundColor!="rgb(154, 250, 129)"){

        socket.emit("like",{
            username:name,
            button:data.id,
            postmaker: postcreator,
        })
    }
    else{
        socket.emit("remove_like",{
            username:name,
            button:data.id,
            postmaker: postcreator,
        });
    }
        
    
}

function loadactivity(){
    socket.emit("load_friends_to_activity",{
        username:name,
    })
}


//needs to be done
function loadmorebtn(){
    if(document.getElementById("loadmorelogo").className=="fa fa-refresh fa-spin"){
        document.getElementById("loadmorelogo").className="fa fa-refresh";

    }
    else{
        document.getElementById("loadmorelogo").className="fa fa-refresh fa-spin"
    }

}