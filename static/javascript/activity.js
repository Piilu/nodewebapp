
//hetkel saadetakse see koikidele kasutajatele kui keegi joinib roomi
socket.on("change_activity_send",function(data){
    loadactivity();
})
function loadactivity(){
    socket.emit("load_friends_to_activity",{
        username:name,
    })
}
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
        node.innerHTML ='<a  href="">'+data[i].username+'<br><p class="watchingstatus">Vibing in  <strong id="'+data[i].username+"activitystatus"+'">'+data[i].status+" room"+ ' </strong></p></a>'
        document.getElementById("activitydiv").append(node);
    }
})