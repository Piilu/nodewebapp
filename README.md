<h1>Watchparty notes</h1>

<strong>To Do:</strong>
1. Possibility to make rooms with Youtube links ("movie name is not required")
1. maybe delete privateroom password from memory when disconnected??
1. some settings in videoplayer page for changeing the video (only for the room owner).
1. make clickkable links in chat.
1. When updating user friends in database maybe check in flask if this username actually exists.
    
<strong>Bugs:</strong>
- Does not make difference if you put upper case letters in your name (has to be hashed)
- if refresh too fast it doubles user (videoplayer html) but it fixes itself
- Server throws error when username folder already exist
- When accpeting friend request it doubles some posts friends posts. (Fixed by refreshing the page) (Temporary fixed by forceing browser to refresh) 

    

<strong>Pending work:</strong>
- New style 

<strong>Materials</strong>
---
 - File upload using node https://medium.com/@ShiyaLuo/simple-file-upload-with-express-js-and-multer-in-node-js-7c2286457ff9





<strong>MYSQL SERVER CONNECTION</strong>
---
```
 $query = 'SELECT * FROM flask WHERE Username =' + connection.escape(regUsername);
    connection.query($query, function(err, rows, fields) {
        if(err){
            console.log("An error ocurred performing the query (Register find).");
            return;
        }
        console.log("Register find query succesfully executed");
       
    });
```
<strong>HTML snippets</strong>
---
<strong>Accept or Decline friend request</strong>
```
 <div>
       <h1 class="addfriendListp">Testing</h1>
       <button class="redbtn">Decline</button>
       <button class="greenbtn">Accept</button>
 </div>
```
<strong> User post template example (old style)</strong>
```
 <div class="postdiv border2">
              <div class="postdiv border2">
                <a class="postName" href="#">'+data[i]+'</a>
                <div style="padding:  0.5em; margin-bottom: 5%;">
                  <div class="limit" style="line-height: 2;">
                    <p>'+allposts[i]+'</p>
                  </div>
                </div>
                <div  class="postfooter postlikes" style=" bottom: 4em;">
                  0 likes
                </div>
                <div class="postfooter postfootercontainer">
                  <div class="postfootercontent">
                    <button onclick="likebtn(this);"id="'+allpostsids[i]+'" class="btnposts fa fa-thumbs-o-up"> LIKE</button></div><div class="postfootercontent">
                      <button class="btnposts fa fa-comment-o" onclick="commentbtn(this);"> COMMENT</button>
                    </div>
                  </div>
                </div>
                <div class="postcomments" id="postcommentssec" style="display: none">
                    <div style="padding-top: 5%; text-align: center;">
                      <input class="commentinput" type="text" name="" id="" placeholder="Comment ...">
                    </div>
                </div>
            </div>
```
<strong>Post for Javascript loading: </strong>
```
<div class="postdiv border2"><a class="postName" href="#">'+data[i]+'</a><div style="padding:  0.5em; margin-bottom: 5%;"><div class="limit" style="line-height: 2;"><p>'+allposts[i]+'</p></div></div><div id="'+allpostsids[i]+"likenr"+'" class="postfooter postlikes" style=" bottom: 4em;">'+alllikes[i]+' likes</div><div class="postfooter postfootercontainer"><div class="postfootercontent"><button onclick="likebtn(this);"id="'+allpostsids[i]+'" class="btnposts fa fa-thumbs-o-up"> LIKE</button></div><div class="postfootercontent"><button id="'+allpostsids[i]+'" class="btnposts fa fa-comment-o" onclick="commentbtn(this);"> COMMENT</button></div></div></div> <div class="postcomments" id="'+allpostsids[i]+"postcommentssec"+'" style="display: none"><div style="padding-top: 5%; text-align: center;"><input class="commentinput" type="text" name="" id="" placeholder="Comment ..."></div></div>
```
<strong>Post for Javascript (When post is made)</strong>
```
<div class="postdiv border2"><a class="postName" href="#">'+data.username+'</a><div style="padding:  0.5em; margin-bottom: 5%;"><div class="limit" style="line-height: 2;"><p>'+data.message+'</p></div></div><div id="'+thispostid+"likenr"+'" class="postfooter postlikes"   style=" bottom: 4em; ">0 likes</div><div class="postfooter postfootercontainer"><div class="postfootercontent"><button  onclick="likebtn(this);" id="'+thispostid+'" class="btnposts fa fa-thumbs-o-up"> LIKE</button></div><div class="postfootercontent"><button id="'+thispostid+'" class="btnposts fa fa-comment-o" onclick="commentbtn(this);"> COMMENT</button></div></div></div><div class="postcomments" id="'+thispostid+"postcommentssec"+'" style="display: none"><div style="padding-top: 5%; text-align: center;"><input class="commentinput" type="text" name="" id="" placeholder="Comment ..."></div></div>
```
<strong>Javascript snippet</strong>
---
<strong>Check if post is already liked</strong>
```
$query = 'SELECT * FROM likedposts WHERE Username ='+"'"+data.username+"'";;
connection.query($query, function(err, rows, fields) {
    if(err){
        console.log(err);
        return;
    }
    console.log("likes find query succesfully executed");
    var row;
    var alllikedposts = [];
    var nolikedposts="False";
    Object.keys(rows).forEach(function(key) {
      row = rows[key];
      if(row.PostID ==data.username){
        alllikedposts.push(row.PostID);
      }
      else{
        nolikedposts = "True";
      }
    });       
  });
```





<strong>Right activity snippets</strong>
---
<strong>Activity item</strong>
```
<div class="statusitem">
    <a href="">Rainer Piil <br><p class="watchingstatus">Watching <i>Movie name</i></p></a>
</div>
```
<strong>Comment snippets</strong>
---
<strong>Post comments section</strong>
```
<div class="postcomments" id="postcommentssec" style="display: none"><div style="padding-top: 5%; text-align: center;"><input class="commentinput" type="text" name="" id="" placeholder="Comment ..."></div></div>
```

<strong>User comment itme</strong>
```
<div class="postcommentssubdiv"><div style="width: 20%;"><a href="#">NAME</a></div><div class="usercommenttext"><p></p></div></div>
```

<strong>Modal snippet</strong>
---
```
<div tabindex="0" onkeydown="closeListModalEsc();" style="animation: fadeani 0.55s;" id="createModal" class="modal">
  <div style="height: 80%;"  class="modal-content modalfont">
    <span onclick="closeListModal();" class="close">&times;</span>

    <h1 style="text-align: center;">SETTINGS</h1>
    <div style=" height: 80%;" id="roomcreatdiv" class="modalroomcreate">

   <div id="roomsettings" class="roomList">
     <p style="text-align: center; opacity: 0.5;">You have not created any rooms</p>
   </div>
    </div>
  </div>
</div>
```