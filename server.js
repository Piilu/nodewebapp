const { Socket } = require('dgram');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const router = require("./router.js");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const mysql = require('mysql');
//const databasehost = "192.168.137.1"//192.168.1.139
//const datauser = "root"//data
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || process.env.SERVER_PORT;



//COOKIES//
const oneDay = 1000 * 60 * 60 * 24;
const long = 30 * 86400 * 1000;

//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: long },
    resave: false
}));

var connection;
//CONNECT TO DATABASE//
function connectDb(){

  connection = mysql.createPool({
    connectionLimit: 10,
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE,
    name: "watchparty",
  });
}
connectDb();


connection.on('error',function(err){
  // in case of error
      console.log(err.code);
      console.log(err.fatal);
});

////////////



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());



app.use('/static',express.static("static"));
app.use("/",router);




//All Socketio//
var usernames ={};
var allusernames = {};
var hosts = []

io.sockets.on('connection', function(socket){
  socket.on("join",function(data){
    allusernames[data.username] = socket.id;
   // console.log(data.username+" joined");

   
    socket.on("disconnect",function(){
      console.log(data.username +" Disconnected");
      delete allusernames[data.username];
    });
  });
  socket.on('join room', function(data) {

        socket.nickname = data.username;
        socket.join(data.room);
        usernames[socket.id] = data.username;
        $query = 'INSERT INTO friendsonline (Username, Status) VALUES '+ '('+'"'+data.username+'"'+","+'"'+data.status+'"'+')';
        connection.query($query, function(err, rows, fields) {
          if(err){
            console.log(err);
            return;
          }
          console.log("Friends online find query succesfully executed");
          io.emit("change_activity_send",data);//hetkel saadab koguaeg infot igale inimesele kui keegi ruumi joinib oleks vaja muuta

          
        });

     
        //console.log(usernames)
        var userids = [];
        var users = [];
        
        //console.log(socket.id+ " " + data.username)
        //a++;
        var count = io.sockets.adapter.rooms[data.room];
        //console.log(count)
        for (var clientId in count.sockets ) {

            //this is the socket of each client in the room.
            var clientSocket = io.sockets.connected[clientId];
          //  if(clientId == socket.id){
             // usernames.push(data.username);
            //}
           
            
            userids.push(clientId);
           // console.log(users);
            
            //you can do whatever you need with this
            //console.log(clientSocket);
        if(count == undefined){
          var count = 0;
        }
        else{
          var count = io.sockets.adapter.rooms[data.room].length;
        }
        //console.log('Praegu on ' + count+ " kasutajat toas "+data.room);
        //console.log("User " + data.username + " Joined Room : " + data.room);
      //  console.log(users);
         }
       //console.log("All connected users")
       for(i in userids){
         //console.log("Username: "+usernames[usersid[i]])
         users.push(usernames[userids[i]]);
        }
        if(count == 1){
          var host = users[0];
          hosts.push({room:data.room,name:data.username}) 
        }
        else{
          console.log("HETKEL ON HOST",hosts)
        }
        console.log(host);
      // console.log(users);

        
        
        
        socket.on("disconnect",()=>{
          $query = 'DELETE FROM friendsonline WHERE Username = ' +"'"+data.username+"'"+' AND Status =' +"'"+data.status+"'"+'' ;
          connection.query($query, function(err, rows, fields) {
            if(err){
              console.log(err);
              return;
            }
            console.log("Friends online DELETE find query succesfully executed");
            io.emit("change_activity_send",data);//hetkel saadab koguaeg infot igale inimesele kui keegi ruumi joinib oleks vaja muuta

          });

          //console.log(socket.id);
          delete usernames[socket.id];
          //console.log(usernames);

        //  console.log(usname + " Leaved");
       
      //  console.log(users.length);
      
        
        //console.log(usernames);
        //console.log(users);
         // a--;
          var count = io.sockets.adapter.rooms[data.room];
          if(count == undefined){
            count = 0
          }
          else{
            var count = io.sockets.adapter.rooms[data.room].length;
          }

        //  console.log('Praegu on ' + count+ " kasutajat toas "+data.room);
        io.to(data.room).emit('count',count);
        io.to(data.room).emit('send_disconnect',users);
        
      });
        io.to(data.room).emit('count',count);
        io.to(socket.id).emit('userid',socket.id);
        io.to(data.room).emit('join_room_send',users);
        io.to(data.room).emit("sync_on_join_send_test",users);

        io.to(socket.id).emit('join_room_send_name',data);
       // io.to(data.room).emit('join_room__send_test',"test");


        });

        socket.on("send_message",function(data){
          socket.broadcast.to(data.room).emit("recive_message",data);
          io.to(socket.id).emit("recive_message_me",data);

        });
        socket.on("update_roomlist",function(data){
          $query =  'SELECT * FROM '+data.username+'__'+'rooms'+' WHERE Roomowner = ' +"'"+data.username+"'";
          connection.query($query, function(err, rows, fields) {
              if(err){
                  console.log("An error ocurred performing the query (Register find).");
                  return;
              }
              console.log("User rooms succesfully executed");
              var row;
              var userrooms =[];
              var roommode =[];
              //Getting plain text
              Object.keys(rows).forEach(function(key) {
                  row = rows[key];
                  roommode.push(row.Mode);
                  userrooms.push(row.Roomname);      
                                  
                  
              });
              //console.log(roommode);
              //console.log(userrooms);

             
              
              //console.log("Kasutajal "+data.username+" on "+rows.length+" ruumi");
              io.to(socket.id).emit("update_roomlist_lenght",rows.length);
              io.to(socket.id).emit("update_roomlist_mode",roommode);
              io.to(socket.id).emit("update_roomlist_send",userrooms);
            });
            
        });

        socket.on("get_all_users",function(data){
          $query = 'SELECT * FROM flask';
          connection.query($query, function(err, rows, fields) {
              if(err){
                  console.log("An error ocurred performing the query (Register find).");
                  return;
              }
              var row;
              var allusers =[];
              Object.keys(rows).forEach(function(key) {
                row = rows[key];
                if(row.Username == data.username){
                  console.log("do not push");
                }
                else{

                  allusers.push(row.Username);
                }

            });
            io.to(socket.id).emit("get_all_users_lenght",rows.length);
            io.to(socket.id).emit("get_all_users_send",allusers);
          });

        });

        socket.on("get_this_user_rooms",function(data){
          $query = 'SELECT * FROM '+data.username+'__'+'rooms'+' WHERE Roomowner = ' +"'"+data.username+"'";
          connection.query($query, function(err, rows, fields) {
              if(err){
                  console.log("An error ocurred performing the query (Register find).");
                  return;
              }
              var row;
              var thisuserrooms=[];
              var thisuserroommode=[];
              Object.keys(rows).forEach(function(key){
                row=rows[key];
                thisuserrooms.push(row.Roomname);
                thisuserroommode.push(row.Mode)
              })
              io.to(socket.id).emit("get_this_user_rooms_lenght",rows.length);
              io.to(socket.id).emit("get_this_user_roommode",thisuserroommode);
              io.to(socket.id).emit("get_this_user_rooms_send",thisuserrooms);
              
             
          });
        })

        socket.on("get_this_friend_rooms",function(data){
          $query = 'SELECT * FROM '+data.username+'__'+'rooms'+' WHERE Roomowner = ' +"'"+data.username+"'";
          connection.query($query, function(err, rows, fields) {
              if(err){
                  console.log("An error ocurred performing the query (Register find).");
                  return;
              }
              var row;
              var thisuserrooms=[];
              var thisuserroommode=[];
              Object.keys(rows).forEach(function(key){
                row=rows[key];
                thisuserrooms.push(row.Roomname);
                thisuserroommode.push(row.Mode)
              })
              io.to(socket.id).emit("get_this_friend_rooms_lenght",rows.length);
              io.to(socket.id).emit("get_this_friend_roommode",thisuserroommode);
              io.to(socket.id).emit("get_this_friend_rooms_send",thisuserrooms);
              
             
          });
        })


        socket.on("Playbtn",function(data){
          io.to(data.room).emit("Playbtn_send",data);
        })
        socket.on("Pausebtn",function(data){
          io.to(data.room).emit("Pausebtn_send",data);
        })
        socket.on("syncUp",function(data){
          socket.broadcast.to(data.room).emit("syncUp_send",data);
          
        })
  
        socket.on("makehost",function(data){
          hosts.push({room:data.room,name:data.username})
          io.to(data.room).emit("makehost_send",data);
        });

        socket.on("play_native",function(data){
          socket.broadcast.to(data.room).emit("play_native_send",data);
        })
        socket.on("pause_native",function(data){
          socket.broadcast.to(data.room).emit("pause_native_send",data);
        })

        socket.on("sync_on_join",function(data){

          
          socket.broadcast.to(data.room).emit("sync_on_join_send",data);

        })

        socket.on("host_disconnect",function(data){
          console.log("laks labi");
          io.to(data.room).emit("host_disconnect_send",data);
        })

        socket.on("update_friends",function(data){
          $query = 'SELECT * FROM requests WHERE Touser =' +"'"+data.username+"'";
            var userrequests = [];
            connection.query($query, function(err, rows, fields) {
            if(err){
              console.log(err);
              return;
          }
            console.log("Requests find query succesfully executed");
            var row;
            Object.keys(rows).forEach(function(key){
              row=rows[key];
              userrequests.push(row.Usersent);
              
            })
            //console.log(userrequests);
            io.to(socket.id).emit("update_friends_send",userrequests.length);
          });

         // console.log(data.username +" friends updated");
        })

        socket.on("addfriend",function(data){
          var all = io.sockets.clients();
          var allconnectedusers = [];
        
          for (var clientId in all.sockets ) {

            //this is the socket of each client connected.
            var clientSocket = io.sockets.connected[clientId];
            allconnectedusers.push(clientId);
         }
         // console.log(socket.id);
         // console.log(allconnectedusers);
          //console.log(allusernames);


          $query = 'SELECT * FROM requests';
          var cancel = "False";
          connection.query($query, function(err, rows, fields) {
          if(err){
            console.log(err);
            return;
        }
          console.log("Requests find query succesfully executed");
          var row;
          Object.keys(rows).forEach(function(key){
            row=rows[key];
            if(row.Usersent == data.username && row.Touser == data.friendname ||row.Usersent == data.friendname && row.Touser == data.username){
              cancel = "True";
            }
          })
          //console.log(rows);
          if(cancel == "False"){
            if(rows.length >= 0){
              $query = 'INSERT INTO requests (Usersent, Touser) VALUES '+ '('+'"'+data.username+'"'+","+'"'+data.friendname+'"'+')';
              connection.query($query, function(err, rows, fields) {
                if(err){
                  console.log(err);
                  return;
                }
                console.log("requests 2 find query succesfully executed");
                io.to(allusernames[data.friendname]).emit("addfriend_send",data)
                io.to(socket.id).emit("addfriend_send_show",data);

                
              });
            }else{
              io.to(socket.id).emit("addfriend_send_failed",data);
            }
          }
        });




         // io.to(socket.id).emit("addfriend_send",data);
        })
        socket.on("check_requests",function(data){
          $query = 'SELECT * FROM requests';
          var cancel = "False";
          var arefriends = "False";
          connection.query($query, function(err, rows, fields) {
          if(err){
            console.log(err);
            return;
        }
          console.log("Requests find query succesfully executed");
          var row;
          Object.keys(rows).forEach(function(key){
            row=rows[key];
            if(row.Usersent == data.username && row.Touser == data.friendname ||row.Usersent == data.friendname && row.Touser == data.username){
              cancel = "True";
            }
          })
          if(cancel == "False"){
            $query = 'SELECT * FROM '+data.username+'__'+'friends'+' WHERE Username = ' +"'"+data.friendname+"'";
            connection.query($query, function(err, rows, fields) {
              if(err){
                console.log(err);
                return;
            }
              console.log("Requests check friends find query succesfully executed");          
              if(rows.length!=0){
                io.to(socket.id).emit("check_requests_sent_2",data)

              }
              else{

                io.to(socket.id).emit("check_requests_send",data)
              }
            });

          }
          else{
            io.to(socket.id).emit("check_requests_sent",data);
          }
          });


        });
    
        socket.on("accept_request",function(data){
          $query = 'DELETE FROM requests WHERE Usersent = ' +"'"+data.friendname+"'"+' AND Touser =' +"'"+data.username+"'"+'' ;
          connection.query($query, function(err, rows, fields) {
          if(err){
            console.log(err);
            return;
        }
          console.log("Declined 2 find query succesfully executed");
    });
    $query = 'SELECT * FROM '+data.username+'__'+'friends'+' friends WHERE Username = ' +"'"+data.friendname+"'";
            connection.query($query, function(err, rows, fields) {
                if(err){
                    console.log(err);
                    return;
                }
                console.log("add friend find query succesfully executed");
                var row;
                Object.keys(rows).forEach(function(key){
                row=rows[key];
              })
                if(rows.length >= 0){
                  $query = 'INSERT INTO '+data.username+'__'+'friends'+' (Username) VALUES '+ '('+'"'+data.friendname+'"'+')';
                  connection.query($query, function(err, rows, fields) {
                      if(err){
                          console.log("An error ocurred performing the query (Friends).");
                          return;
                      }
                      $query = 'INSERT INTO '+data.friendname+'__'+'friends'+' (Username) VALUES '+ '('+'"'+data.username+'"'+')';
                      connection.query($query, function(err, rows, fields) {
                          if(err){
                              console.log("An error ocurred performing the query (Friends).");
                              return;
                          }
                          console.log("Friends find query succesfully executed");
                    });
                  });
                  io.to(socket.id).emit("accept_request_send",data);  
                  io.to(allusernames[data.friendname]).emit("accept_request_send_notify",data);
                }
              
              });
                         
            });


            socket.on("decline_request",function(data){
              $query = 'DELETE FROM requests WHERE Usersent = ' +"'"+data.friendname+"'"+' AND Touser =' +"'"+data.username+"'"+'' ;
              connection.query($query, function(err, rows, fields) {
              if(err){
                console.log(err);
                return;
            }
              console.log("Declined 2 find query succesfully executed");
              io.to(socket.id).emit("decline_request_send",data);
              io.to(allusernames[data.friendname]).emit("decline_request_notify",data);
        });
            });


            socket.on("get_all_friends",function(data){
              $query = 'SELECT * FROM  '+data.username+'__'+'friends'+'';
              connection.query($query, function(err, rows, fields) {
                  if(err){
                      console.log(err)
                      return;
                  }
                  var row;
                  var allfriends =[];
                  Object.keys(rows).forEach(function(key) {
                    row = rows[key];
                      allfriends.push(row.Username);
                  });
                  io.to(socket.id).emit("get_all_friends_lenght",allfriends.length);
                  io.to(socket.id).emit("get_all_friends_send",allfriends);
            });
          });

          socket.on("request_update",function(data){
            $query = 'SELECT * FROM requests WHERE Touser =' +"'"+data.username+"'";
            var userrequests = [];
            connection.query($query, function(err, rows, fields) {
            if(err){
              console.log(err);
              return;
          }
            console.log("Requests find query succesfully executed");
            var row;
            Object.keys(rows).forEach(function(key){
              row=rows[key];
              userrequests.push(row.Usersent);
              
            })
            //console.log(userrequests);
            io.to(socket.id).emit("get_requests_lenght",userrequests.length);
            io.to(socket.id).emit("addfriend_send_update",userrequests);
          });

          })

          socket.on("make_post",function(data){
            var makepostdata = []
            var goon ="False";
            $query = 'SELECT * FROM '+data.username+'__'+'friends'+'';
            connection.query($query, function(err, rows, fields) {
                if(err){
                    console.log(err);
                    return;
                }
                var row2;
                var friends = [];
                Object.keys(rows).forEach(function(key) {
                  row2 = rows[key];
                  friends.push(row2.Username)
                });
                $query = 'SELECT * FROM posts';
                connection.query($query, function(err, rows, fields) {
                    if(err){
                        console.log(err);
                        return;
                    }
                    console.log(rows);
                    var row3;
                    var allpostids = [];
                    Object.keys(rows).forEach(function(key) {
                      row3 = rows[key];
                      allpostids.push(row3.PostID);
                    });
                    //console.log(allpostids);
                    var postid = data.username+'#'+(Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
                    for(let i = 0;i<allpostids.length;i++){
                      if(allpostids[i]==postid){
                        var postid = data.username+'#'+(Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
                        i=0;
                      }
                      else{
                        goon ="True"
                      }
                    }
                    if(goon == "True"||allpostids ==0){
    
                      var likes = "0";
                      $query = 'INSERT INTO '+data.username+'__'+'posts '+'  (PostID, Username, Likes, Post) VALUES '+ '('+'"'+postid+'"'+","+'"'+data.username+'"'+","+'"'+likes+'"'+","+'"'+data.message+'"'+')';
                      connection.query($query, function(err, rows, fields) {
                        if(err){
                          console.log(err);
                          return;
                        }

                        $query = 'INSERT INTO posts (PostID, Username, Likes, Post) VALUES '+ '('+'"'+postid+'"'+","+'"'+data.username+'"'+","+'"'+likes+'"'+","+'"'+data.message+'"'+')';
                        connection.query($query, function(err, rows, fields) {
                          if(err){
                            console.log(err);
                            return;
                          }
                        makepostdata.push({Postid:postid, Username:data.username,Message:data.message})
                        console.log(makepostdata)
                        console.log("Posts query succesfully executed");
                      //  io.to(socket.id).emit("all_posts_ids",allpostids);
                      //  io.to(socket.id).emit("this_post_id",postid);
                        io.to(socket.id).emit("make_post_send",makepostdata);
                        for(let i =0;i<friends.length;i++){
                          if(allusernames[friends[i]]){
                            //io.to(socket.id).emit("all_posts_ids",allpostids);
                            //io.to(allusernames[friends[i]]).emit("this_post_id",postid);
                            io.to(allusernames[friends[i]]).emit("make_post_send",makepostdata);

                            // io.to(socket.id).emit("make_post_send",data);
                          }
                        }
                      });
                    }
                    )};
                  }); 
            });

          
          })

          socket.on("load_posts",function(data){
            $query = 'SELECT * FROM likedposts';// WHERE Username ='+"'"+data.username+"'";
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
                  if(row.Username ==data.username){
                    alllikedposts.push(row.PostID);
                  }
                  else{
                    nolikedposts = "True";
                  }
                });   
                //console.log(alllikedposts)    
                io.to(socket.id).emit("all_liked_posts_send",alllikedposts);
                //console.log(alllikedposts)
              });
            $query = 'SELECT * FROM '+data.username+'__'+'friends'+'';
            connection.query($query, function(err, rows, fields) {
                if(err){
                    console.log(err);
                    return;
                }
                var row2;
                var friends = [];
                Object.keys(rows).forEach(function(key) {
                  row2 = rows[key];
                  friends.push(row2.Username);
                });        
                console.log("Friends: "+friends);

                $query = 'SELECT * FROM posts';//order by PostID DESC LIMIT 10 OFFSET '+data.offset;  //'SELECT * FROM posts order by nr DESC LIMIT 10 OFFSET '+data.offset;
                connection.query($query, function(err, rows, fields) {
                    if(err){
                        console.log(err);
                        return;
                    }
                    var row;
                    var postdata =[];
                    var allposts = [];
                    var allpostusernames = [];
                    var allpostids = [];
                    var alllikes = [];
                    Object.keys(rows).forEach(function(key) {
                      row = rows[key];
                      if(row.Username==data.username){
                        postdata.push({Postid: row.PostID, Likes:row.Likes, Username:row.Username,Post:row.Post});
                        alllikes.push(row.Likes)
                        allpostids.push(row.PostID);
                        allposts.push(row.Post);
                        allpostusernames.push(row.Username);
                    }

                        for(let i =0;i<friends.length;i++ ){
                          if(row.Username ==friends[i]){
                            alllikes.push(row.Likes)
                            allpostids.push(row.PostID);
                            allposts.push(row.Post);
                            allpostusernames.push(row.Username);
                            postdata.push({Postid: row.PostID, Likes:row.Likes, Username:row.Username,Post:row.Post});
                          }
                        }
                      
                    }); 
                    
                                 
                    console.log("Posts2 query succesfully executed");
                    //io.to(socket.id).emit("load_likes_send",alllikes);
                    //io.to(socket.id).emit("all_posts_ids",allpostids);
                   // io.to(socket.id).emit("load_posts_send_posts",allposts);
                    io.to(socket.id).emit("load_posts_send",postdata);
                  //  console.log(postdata);
                });      


            });
          
          });

          socket.on("like",function(data){
            var friends = [];
            $query = 'SELECT * FROM '+data.username+'__'+'friends'+'';
            connection.query($query, function(err, rows, fields) {
                if(err){
                    console.log(err);
                    return;
                }
                var row2;
                Object.keys(rows).forEach(function(key) {
                  row2 = rows[key];
                  friends.push(row2.Username);
                });
              });
            $query = 'INSERT INTO likedposts (Username, PostID) VALUES '+ '('+'"'+data.username+'"'+","+'"'+data.button+'"'+')';//'INSERT INTO '+data.postmaker+'__'+'likedposts'+' (Username, PostID) VALUES '+ '('+'"'+data.username+'"'+","+'"'+data.button+'"'+')';
            connection.query($query, function(err, rows, fields) {
                if(err){
                    console.log(err);
                    return;
                }
                console.log("addtolikedposts find query succesfully executed");  
              });
            $query = 'SELECT * FROM posts WHERE PostID ='+"'"+data.button+"'";//'SELECT * FROM '+data.postmaker+'__'+'posts'+' WHERE PostID ='+"'"+data.button+"'"
            connection.query($query, function(err, rows, fields) {
                if(err){
                    console.log(err);
                    return;
                }
                console.log("likes find query succesfully executed");
                var row;
                Object.keys(rows).forEach(function(key) {
                  row = rows[key];
                });    
                var likes = parseInt(row.Likes)+1;                
            $query = 'UPDATE posts SET Likes = '+"'"+likes.toString()+"'"+' WHERE PostID='+"'"+data.button+"'";//'UPDATE '+data.postmaker+'__'+'posts'+' SET Likes = '+"'"+likes.toString()+"'"+' WHERE PostID='+"'"+data.button+"'"
            connection.query($query, function(err, rows, fields) {
                if(err){
                    console.log(err);
                    return;
                }
                console.log("likes2 find query succesfully executed");
                io.to(socket.id).emit("addlike_send",likes.toString());
                io.to(socket.id).emit("like_send",data.button);
                
                for(let i =0;i<friends.length;i++){
                  if(allusernames[friends[i]]){
                    io.to(allusernames[friends[i]]).emit("update_likes",likes.toString());
                    io.to(allusernames[friends[i]]).emit("update_likes_send",data.button);
                  }
                }

               
               
            });

               
            });

          });

          socket.on("remove_like",function(data){
            var friends = [];
            $query = 'SELECT * FROM '+data.username+'__friends'+'';
            connection.query($query, function(err, rows, fields) {
                if(err){
                    console.log(err);
                    return;
                }
                var row2;
                Object.keys(rows).forEach(function(key) {
                  row2 = rows[key];
                  friends.push(row2.Username);
                });
              });
            $query = 'DELETE FROM likedposts WHERE Username = ' +"'"+data.username+"'"+' AND PostID =' +"'"+data.button+"'"+'' ;
            connection.query($query, function(err, rows, fields) {
                if(err){
                    console.log(err);
                    return;
                }
                console.log("remove from liked posts find query succesfully executed");  
              });
            $query = 'SELECT * FROM posts WHERE PostID ='+"'"+data.button+"'";;
            connection.query($query, function(err, rows, fields) {
                if(err){
                    console.log(err);
                    return;
                }
                console.log("removelike find query succesfully executed");
                var row;
                Object.keys(rows).forEach(function(key) {
                  row = rows[key];
                });       
                var likes = parseInt(row.Likes)-1;                
            $query = 'UPDATE posts SET Likes = '+"'"+likes.toString()+"'"+' WHERE PostID='+"'"+data.button+"'";
            connection.query($query, function(err, rows, fields) {
                if(err){
                    console.log(err);
                    return;
                }
                console.log("remove like2 find query succesfully executed");
                io.to(socket.id).emit("addlike_send",likes.toString());
                io.to(socket.id).emit("remove_like_send",data.button);  
                
                for(let i =0;i<friends.length;i++){
                  if(allusernames[friends[i]]){
                    io.to(allusernames[friends[i]]).emit("update_likes",likes.toString());
                    io.to(allusernames[friends[i]]).emit("update_likes_send",data.button);

                  }
                }
            });
               
            });

          });
            //  Refreshes when main page is load maybe needs a fix but it is okay for now 
          socket.on("load_friends_to_activity",function(data){
            $query = 'SELECT * FROM '+data.username+"__friends"+''// WHERE Username ='+"'"+data.username+"'";
            connection.query($query, function(err, rows, fields) {
                if(err){
                    console.log(err);
                    return;
                }
                console.log("Actifity friends find query succesfully executed");
                var row;
                var friends = [];
                Object.keys(rows).forEach(function(key) {
                  row = rows[key];
                  friends.push(row.Username); 
                  
                });     
                $query = 'SELECT * FROM friendsonline';
                connection.query($query, function(err, rows, fields) {
                if(err){
                    console.log(err);
                    return;
                }
                console.log("Actifity friends find query succesfully executed");
                var row;
                var friendsonline = [];
                Object.keys(rows).forEach(function(key) {
                  row = rows[key];
                  for(let i =0;i<friends.length;i++){

                    if(friends[i]==row.Username){
                      friendsonline.push(row.Username);
                      
                    }
                  }
                });
                io.to(socket.id).emit("load_friends_to_activity_send",friendsonline); 
                
                
            });          
            });

          })



});







app.use((req, res, next) => {
    res.status(404).send({
    status: 404,
    error: "Not found"
    })
   })

app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).send("Something Broke!");
   })
server.listen(port,()=>{
    console.log("Server is running on port "+port);
});