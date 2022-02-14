<h1>Watchparty notes</h1>

<strong>To Do:</strong>
1. handle friend request accept
1. Make activity separate js file
1. Add time and date (if time :) )
1. Update room create system.
1. Possibility to make rooms with Youtube links ("movie name is not required")
1. some settings in videoplayer page for changeing the video (only for the room owner).
1. make clickkable links in chat.
1. When updating user friends in database maybe check in flask if this username actually exists.
1. think about dynamical scroll AGAIN
    
<strong>Bugs:</strong>
- If user sends a request to other user who is on the user find tab then the "add friend" status does not change. Also both see "Request sent"
- if connection is lost while user is connected to room, then activity status would not change
- If there are two different rooms named same by same user than it's a big big problem (have to make room id's)
- if refresh too fast it doubles user (videoplayer html) but it fixes itself
- Server throws error when username folder already exist
- When accpeting friend request it doubles some posts friends posts. (Fixed by refreshing the page) (Temporary fixed by forceing browser to refresh) 
- dynamical scroll is broken when data is less then 10 it sometimes dobles the posts, also sometimes it does not load all data. (removed)
- real time update does not work between users who are not friends (you can leave it for now)

    

<strong>Pending work:</strong>
- Bug fixes

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
<strong>Handlebars</strong>
```
        let HTMLPath = path.join(__dirname, './templates/registered/profile.html');
        var template = Handlebars.compile(fs.readFileSync(HTMLPath, 'utf8'));
        var data = { "name": user,};
        var result = template(data);
        res.send(result)
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
<strong> User profile post template example (new style)</strong>

```
<div style="text-align: left; animation: fadein 1s;" class="postborder maincontainer">
                    <a id="'+data[i].Postid+" username"+'" class="postName maincontainer"
                        href="#">'+data[i].Username+'</a>
                    <div class="limit maincontainer" style="line-height: 2;">
                        <p style="white-space: pre-wrap;" class="maincontainer">'+data[i].Post+'</p>
                    </div>
                    <div style="width: 90%;" class="postline maincontainer">
                        <p id="'+data[i].Postid+" likenr"+'">'+data[i].Likes+' likes</p>
                    </div>
                    <div class="postfooter">
                        <div>
                            <button onclick="likebtn(this);" id="'+data[i].Postid+'" class="btnposts fa fa-thumbs-o-up">
                                LIKE</button>
                        </div>
                        <div>
                            <button onclick="commentbtn(this);" id="'+data[i].Postid+'"
                                class="btnposts fa fa-comment-o">COMMENT</button>
                        </div>
                    </div>
                    <div id="'+data[i].Postid+" postcommentssec"+'" style="display: none">
                        <input class="commentinput" type="text" name="" id="" placeholder="Not available" disabled>
                    </div>
                </div>
```

<strong> User profile post template example (new style)</strong>

```
<div style="text-align: left; animation: fadein 1s;"class="postborder maincontainer"><a id="'+data[i].Postid+"username"+'" class="postName maincontainer"href="#">'+data[i].Username+'</a><div class="limit maincontainer"style="line-height: 2;"><p style="white-space:pre-wrap;" class="maincontainer">'+data[i].Post+'</p></div><div style="width: 90%;" class="postline maincontainer"><p id="'+data[i].Postid+" likenr"+'">'+data[i].Likes+' likes</p></div><div class="postfooter"><div><button onclick="likebtn(this);" id="'+data[i].Postid+'" class="btnposts fa fa-thumbs-o-up">LIKE</button></div><div><button onclick="commentbtn(this);" id="'+data[i].Postid+'"class="btnposts fa fa-comment-o">COMMENT</button></div></div><div id="'+data[i].Postid+" postcommentssec"+'" style="display: none"><input class="commentinput" type="text" name="" id="" placeholder="Not available" disabled></div></div>
```
<strong> User post template example (new style)</strong>
```
<div class="postborder maincontainer">
<a class="postName maincontainer" href="#">Name</a>
<div class="maincontainer" style=" margin-bottom: 5%;">
              <div class="limit maincontainer" style="line-height: 2;"><p class="maincontainer">asdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasd</p>
            </div>
</div>
  <div style="width: 90%;" class="postline maincontainer"><p>0 likes</p></div>
  <div  class="postfooter"> 
    <div>
      <button onclick="likebtn(this);" class="btnposts fa fa-thumbs-o-up"> LIKE</button>
    </div>
    <div>
      <button onclick="likebtn(this);" class="btnposts fa fa-thumbs-o-up"> COMMENT</button>
    </div>
  </div>
</div>
```
<strong>Post for Javascript loading (old style): </strong>
```
<div class="postdiv border2"><a class="postName" href="#">'+data[i]+'</a><div style="padding:  0.5em; margin-bottom: 5%;"><div class="limit" style="line-height: 2;"><p>'+allposts[i]+'</p></div></div><div id="'+allpostsids[i]+"likenr"+'" class="postfooter postlikes" style=" bottom: 4em;">'+alllikes[i]+' likes</div><div class="postfooter postfootercontainer"><div class="postfootercontent"><button onclick="likebtn(this);"id="'+allpostsids[i]+'" class="btnposts fa fa-thumbs-o-up"> LIKE</button></div><div class="postfootercontent"><button id="'+allpostsids[i]+'" class="btnposts fa fa-comment-o" onclick="commentbtn(this);"> COMMENT</button></div></div></div> <div class="postcomments" id="'+allpostsids[i]+"postcommentssec"+'" style="display: none"><div style="padding-top: 5%; text-align: center;"><input class="commentinput" type="text" name="" id="" placeholder="Comment ..."></div></div>
```
<strong>Post for Javascript loading (new style): </strong>
```
<div class="postborder maincontainer"><a class="postName maincontainer" href="#">'+data[i]+'</a><div class="maincontainer" style=" margin-bottom: 5%;"><div class="limit maincontainer" style="line-height: 2;"><p class="maincontainer">'+allposts[i]+'</p></div></div><div style="width: 90%;" class="postline maincontainer"><p id="'+allpostsids[i]+"likenr"+'">'+alllikes[i]+' likes</p></div><div  class="postfooter"> <div><button onclick="likebtn(this);"id="'+allpostsids[i]+'" class="btnposts fa fa-thumbs-o-up"> LIKE</button></div><div><button onclick="commentbtn(this);" id="'+allpostsids[i]+'" class="btnposts fa fa-thumbs-o-up">COMMENT</button></div></div><div style="display: none"><input class="commentinput" type="text" name="" id="" placeholder="Comment ..."></div> </div>
```
<strong>Post for Javascript (When post is made old)</strong>
```
<div class="postdiv border2"><a class="postName" href="#">'+data.username+'</a><div style="padding:  0.5em; margin-bottom: 5%;"><div class="limit" style="line-height: 2;"><p>'+data.message+'</p></div></div><div id="'+thispostid+"likenr"+'" class="postfooter postlikes"   style=" bottom: 4em; ">0 likes</div><div class="postfooter postfootercontainer"><div class="postfootercontent"><button  onclick="likebtn(this);" id="'+thispostid+'" class="btnposts fa fa-thumbs-o-up"> LIKE</button></div><div class="postfootercontent"><button id="'+thispostid+'" class="btnposts fa fa-comment-o" onclick="commentbtn(this);"> COMMENT</button></div></div></div><div class="postcomments" id="'+thispostid+"postcommentssec"+'" style="display: none"><div style="padding-top: 5%; text-align: center;"><input class="commentinput" type="text" name="" id="" placeholder="Comment ..."></div></div>
```
<strong>Post for Javascript (When post is made new)</strong>
```
<div class="postborder maincontainer"><a class="postName maincontainer" href="#">'+data.username+'</a><div class="maincontainer" style=" margin-bottom: 5%;"><div class="limit maincontainer" style="line-height: 2;"><p class="maincontainer">'+data.message+'</p></div></div><div style="width: 90%;" class="postline maincontainer"><p id="'+thispostid+"likenr"+'">0 likes</p></div><div  class="postfooter"> <div><button onclick="likebtn(this);"id="'+thispostid+'" class="btnposts fa fa-thumbs-o-up"> LIKE</button></div><div><button onclick="commentbtn(this);" id="'+thispostid+'" class="btnposts fa fa-thumbs-o-up"> COMMENT</button></div></div><div style="display: none"><input class="commentinput" type="text" name="" id="" placeholder="Comment ..."></div></div>
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