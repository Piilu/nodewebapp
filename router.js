const express = require("express");
const router = new express.Router();
const mysql = require('mysql');
const passwordHash = require('password-hash');
const multer = require('multer');
const fs = require("fs")
const path = require('path');
const databasehost = "192.168.137.1"//192.168.1.139
const datauser = "root"//data
const dotenv = require('dotenv');
const Handlebars = require("handlebars");
const port = process.env.PORT || process.env.SERVER_PORT;
dotenv.config();

var session;
var moviefile;
var roompassword;


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        
      cb(null, 'sort/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
      moviefile = file.originalname;
    }
  })
  const upload = multer({storage: storage})


///When starting to create hash (https://www.npmjs.com/package/password-hash)

      //moves the $file to $dir2
var moveFile = (file, dir2)=>{
    //include the fs, path modules
    var fs = require('fs');
    var path = require('path');
  
    //gets file name and adds it to dir2
    var f = path.basename(file);
    var dest = path.resolve(dir2, f);
  
    fs.rename(file, dest, (err)=>{
      if(err) throw err;
      else console.log('Successfully moved');
    });
  };
  

//CONNECT TO DATABASE//
var connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_DATABASE,
});

connection.connect(function(err) {
    // in case of error
    if(err){
        console.log(err.code);
        console.log(err.fatal);
    }
});

////////////




//Getting all login data//
router.post("/login/",(req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    $query = 'SELECT * FROM flask WHERE Username =' + connection.escape(username);
    connection.query($query, function(err, rows, fields) {
    if(err){
        console.log("An error ocurred performing the query.");
        return;
    }

    console.log("Login query succesfully executed");
    var row;
    //Getting plain text
    Object.keys(rows).forEach(function(key) {
        row = rows[key];
      });
    
    if(rows.length == 1){
        if(passwordHash.verify(password,row.Password)){
            session = req.session;
            if(rows.length > 0){

                session.userid = row.Username;
                console.log("UserID set");
            }
            //localStorage.setItem("Username", session.userid);
            //res.redirect("/");
           // res.send("<script> localStorage.setItem('Username',"+"'"+session.userid+"'"+" ); location.replace('/'); </script>"); 
           res.send("<script>  location.replace('/'); </script>");
            
        }
        else{
            res.send("<script> localStorage.setItem('errorlog','error' ); window.history.back(); </script>");
        }
    }
    else if(rows.length == 0){
        console.log("Account does not exist");
        res.send("<script> localStorage.setItem('errorlogacc','error' ); window.history.back(); </script>");

    }
});
    
 });


router.post("/signup/",(req,res)=>{
    var regEmail = req.body.Email;
    var regUsername = req.body.username;
    var regPassword = req.body.password
    var hashedPassword = passwordHash.generate(regPassword);

    $query = 'SELECT * FROM flask WHERE Username =' + connection.escape(regUsername);
    connection.query($query, function(err, rows, fields) {
        if(err){
            console.log("An error ocurred performing the query (Register find).");
            return;
        }
        console.log("Register find query succesfully executed");
        if(regUsername.length < 3){
            res.send("<script> localStorage.setItem('errorreg','errorusername' ); window.history.back(); </script>");

        }
        else if(regPassword.length <8){
            res.send("<script> localStorage.setItem('errorreg','errorpassword' ); window.history.back(); </script>");


        }

        else if(rows.length == 0){
            if(regEmail.includes('@')){
                $query = 'INSERT INTO flask (Email, Username, Password) VALUES '+ '('+'"'+regEmail+'"'+","+'"'+regUsername+'"'+"," +'"'+hashedPassword+'"'+')';

                 connection.query($query, function(err, rows, fields) {
                     if(err){
                         console.log("An error ocurred performing the query (Register insert).");
                         return;
                        }

                        fs.mkdir("./uploads/"+regUsername+"", function(err) {
                            if (err) {
                              console.log("Already exist");
                              fs.unlinkSync(regUsername);
                            }
                            else {
                              console.log("New directory successfully created.")
                            }
                    
                          });
                          fs.mkdir("./uploads/"+regUsername+"/"+"Private", function(err) {
                            if (err) {
                              console.log("Already exist");
                              
                            }
                            else {
                              console.log("New directory successfully created.")
                            }
                    
                          });
                          fs.mkdir("./uploads/"+regUsername+"/"+"Public", function(err) {
                            if (err) {
                              console.log("Already exist");
                              
                            }
                            else {
                              console.log("New directory successfully created.")
                            }
                    
                          });
                        console.log("Register insert query succesfully executed");

                        res.send("<script> localStorage.setItem('errorlog','succ'); location.replace('/login/'); </script>");

                    });
                    $query ='CREATE TABLE '+regUsername+'__'+'posts'+' (PostID VARCHAR(255), Username VARCHAR(255), Likes VARCHAR(255), Post VARCHAR(255))'; //Tuleb Teha |ID PRIMARY KEY
                    connection.query($query, function(err, rows, fields) {
                        if(err){
                            console.log(err);
                            return;
                        }
                        console.log("NEW Register POSTS find query succesfully executed");
                       
                    });
                    $query ='CREATE TABLE '+regUsername+'__'+'friends'+' (ID INT NOT NULL AUTO_INCREMENT, Username VARCHAR(255), PRIMARY KEY (ID))';
                    connection.query($query, function(err, rows, fields) {
                        if(err){
                            console.log(err);
                            return;
                        }
                        console.log("NEW Register FRIENDS find query succesfully executed");
                       
                    });
                    $query ='CREATE TABLE '+regUsername+'__'+'likedposts'+' (ID INT NOT NULL AUTO_INCREMENT, Username VARCHAR(255), PostID VARCHAR(255),PRIMARY KEY (ID))';
                    connection.query($query, function(err, rows, fields) {
                        if(err){
                            console.log(err);
                            return;
                        }
                        console.log("NEW Register LIKEDPOSTS find query succesfully executed");
                       
                    });

                    $query ='CREATE TABLE '+regUsername+'__'+'rooms'+' (ID INT NOT NULL AUTO_INCREMENT, Roomowner VARCHAR(255), Roomname VARCHAR(255), Moviename VARCHAR(255), Mode VARCHAR(255), Roompassword VARCHAR(255), Filename VARCHAR(255), Path VARCHAR(255), PRIMARY KEY (ID) )';
                    connection.query($query, function(err, rows, fields) {
                        if(err){
                            console.log(err);
                            return;
                        }
                        console.log("NEW Register ROOM find query succesfully executed");
                       
                    });
            }
            else{
                res.send("<script> localStorage.setItem('errorreg','erroremail' ); window.history.back(); </script>");

            }
            
        }
        else if(rows.length == 1){
            res.send("<script> localStorage.setItem('errorreg','error' ); window.history.back(); </script>");
        }

    });    


    
   
});



router.post("/privateroom/",function(req,res){
    session = req.session
    roomid = req.body.roomid;
    roomusername = req.body.ownerid;
    joinroompassword = req.body.joinpassword;
    session.roompassword = joinroompassword;
    //var test = "testpriv";
    
    $query = 'SELECT * FROM '+roomusername+'__'+'rooms'+' WHERE Roomname = ' +"'"+roomid+"'";
    connection.query($query, function(err, rows, fields) {
        if(err){
            console.log("An error ocurred performing the query (privateroom find).");
            console.log(err);
            return;
        }
        console.log("privateroom find query succesfully executed");
        var row;
        //Getting plain text
        Object.keys(rows).forEach(function(key) {
            row = rows[key];
        });
        
        if(row.Roompassword == joinroompassword){
             res.send("<script>location.replace('/"+""+roomusername+""+"/movieroom/"+row.Roomname+"')</script>");
            //location.replace('/movieroom/"+"'"+row.Moviename+"'"+")
        }
        else{
            res.send("<script> localStorage.setItem('errorjoinroom','worngpassword' ); window.history.back(); </script>");
        }
    });
    

});
router.post("/",upload.single('filename'),(req,res) =>{
    session = req.session;
    var roomname = req.body.roomName;
    var moviename = req.body.movieName;
    var mode = req.body.Mode;
    var roomPassword = "none";
    if(mode == "Private"){
        roomPassword = req.body.roomPassword;
    }
    console.log(session.userid);
    const oldpathpublic = "./uploads/"+session.userid+"/"+"Public"+"/"+moviename+"";
    const oldpathprivate = "./uploads/"+session.userid+"/"+"Private"+"/"+moviename+"";
    const filename = "./sort/"+moviefile+"";
    const finaldestpublic  = "http://"+process.env.SERVER_IP+":"+process.env.SERVER_PORT+"/uploads/"+session.userid+"/"+"Public"+"/"+moviename+"/"+moviefile+"";//make that link a varible
    const finaldestprivate  = "http://"+process.env.SERVER_IP+":"+process.env.SERVER_PORT+"/uploads/"+session.userid+"/"+"Private"+"/"+moviename+"/"+moviefile+"";//make that link a varible
/// check if filename exists
    if(mode == "Private"){
        fs.mkdir(oldpathprivate, function(err) {
            if (err) {
              console.log("Already exist");
              fs.unlinkSync(filename);
            }
            else {
              console.log("New directory successfully created.")
    
              moveFile(filename,oldpathprivate);
             
            }
    
          });
    }
    else if(mode=="Public") {
        fs.mkdir(oldpathpublic, function(err) {
            if (err) {
              console.log("Already exist");
              fs.unlinkSync(filename);
            }
            else {
              console.log("New directory successfully created.")
    
              moveFile(filename,oldpathpublic);
             
            }
    
          });

    }
   

     
  // console.log("Room name: "+roomname+" \n"+"Movie name: "+moviename+" \n"+"Mode: "+mode);
    if(session.userid){
        if(mode =="Private"){

            $query = 'INSERT INTO '+session.userid+'__'+'rooms'+' (Roomowner, Roomname, Moviename, Mode, Roompassword, Filename, Path) VALUES '+ '('+'"'+session.userid+'"'+","+'"'+roomname+'"'+"," +'"'+moviename+'"'+","+'"'+mode+'"'+","+'"'+roomPassword+'"'+","+'"'+moviefile+'"'+","+'"'+finaldestprivate+'"'+')';
        }
        else if(mode == "Public"){
            $query = 'INSERT INTO '+session.userid+'__'+'rooms'+' (Roomowner, Roomname, Moviename, Mode, Roompassword, Filename, Path) VALUES '+ '('+'"'+session.userid+'"'+","+'"'+roomname+'"'+"," +'"'+moviename+'"'+","+'"'+mode+'"'+","+'"'+roomPassword+'"'+","+'"'+moviefile+'"'+","+'"'+finaldestpublic+'"'+')';

        }
        connection.query($query, function(err, rows, fields) {
            if(err){
                console.log("An error ocurred performing the query (Rooms).");
                console.log(err);
                return;
            }
            console.log("Rooms query succesfully executed");
            res.send("<script>location.replace('/'); </script>");
        // localStorage.setItem('RoomPassword',"+"'"+roomPassword+"'"+" ); localStorage.setItem('Movieid',"+"'"+moviename+"'"+" ); localStorage.setItem('Roomid',"+"'"+roomname+"'"+" ); 
        });

        


    }
    else{
        res.send("Something went wrong")
    }
});


router.post("/unregistered/",function(req,res){
    nickname = req.body.visitguestname;
    roomname = req.body.visitguestroom;
    roomcreator = req.body.roomcreator;
    session = req.session;
    session.guestname = nickname+" (guest)";
    res.send("<script> location.replace('/"+""+roomcreator+""+"/movieroom/"+""+roomname+"'"+");</script>");
   // res.send("Nickname: "+ nickname +""+"</br>"+" Roomname: "+roomname)
});









//UNREGISTERED//

router.get("/login/",function(req,res){
    session=req.session;
    if(session.guestname){
        req.session.destroy();
        console.log("destroyed");
    }
    if(session.userid){
        res.send("<script> location.replace('/'); </script>");


    }
    else{

        res.sendFile("./templates/unregistered/login.html",{root:__dirname});
    }

});



router.get("/", function(req,res){
    session = req.session;
    if(session.guestname){
        req.session.destroy();
        console.log("destroyed");
    }
    if(session.userid){
        session.roompassword = 0;
        let HTMLPath = path.join(__dirname, './templates/registered/home.html');
        var template = Handlebars.compile(fs.readFileSync(HTMLPath, 'utf8'));
        var data = { "name": session.userid,};
        var result = template(data);
        res.send(result)
        
       // res.sendFile('./templates/registered/home.html',{root:__dirname});
    }
    else{
        res.sendFile('./templates/unregistered/home.html',{root:__dirname});
    }

    
});

router.get("/signup/",function(req,res){
    session = req.session;
    if(session.guestname){
        req.session.destroy();
        console.log("destroyed");
    }
    if(session.userid){
        res.send("<script> location.replace('/'); </script>");
    }
    else{
        res.sendFile("./templates/unregistered/signup.html",{root:__dirname});
        
    }
});

router.get("/:roomusername/movieroom/:room" ,function(req,res){
    room = req.params.room;
    roomusername = req.params.roomusername;
    session=req.session;
    if(session.userid||session.guestname){
        
        $query = 'SELECT * FROM '+roomusername+'__'+'rooms'+' WHERE Roomname = '+'"'+room+'"' ;
        connection.query($query, function(err, rows, fields) {
        if(err){
            console.log("An error ocurred performing the query (movie find).");
            res.send("This room does not exist");
            return;
        }
        console.log("movieroom find query succesfully executed");
        var row;
        //Getting plain text
        Object.keys(rows).forEach(function(key) {
            row = rows[key];
        });
        if(row == undefined){
            res.send("This room does not exist");
        }
        else if(row.Mode == "Public" ){ 
            session = req.session;
            console.log(session.path);
            if(session.path == 1){
                session.path = 0;
                let HTMLPath = path.join(__dirname, './templates/registered/videoplayer.html');
                var template = Handlebars.compile(fs.readFileSync(HTMLPath, 'utf8'));
                var data = { "guestname":session.guestname,"name": session.userid,"roomName":row.Roomname,"roomOwner":row.Roomowner,"movieName":row.Moviename,"moviePath":row.Path};
                var result = template(data);
                res.send(result)
            }
            else{ 
                session.path = 1;
                //localStorage.setItem('host'+room+'',msg[0]);

                //res.send("<script> localStorage.setItem('roomName',"+"'"+row.Roomname+"'"+" );localStorage.setItem('roomOwner',"+"'"+row.Roomowner+"'"+" ); localStorage.setItem('movieName',"+"'"+row.Moviename+"'"+" ); localStorage.setItem('moviePath',"+"'"+row.Path+"'"+" ); location.replace('/"+""+roomusername+""+"/movieroom/"+""+row.Roomname+"'"+")</script>");
                res.send("<script>  location.replace('/"+""+roomusername+""+"/movieroom/"+""+row.Roomname+"'"+")</script>");
            }
            //res.send("<script>window.open('templates/registered/videoplayer.html');</script>")
        }
        else if (row.Mode == "Private"){
            if(session.userid == row.Roomowner){
                session = req.session;

                if(session.path == 1){ 
                    session.path = 0;

                    //res.sendFile("./templates/registered/videoplayer.html",{root:__dirname});
                    session.path = 0;
                    let HTMLPath = path.join(__dirname, './templates/registered/videoplayer.html');
                    var template = Handlebars.compile(fs.readFileSync(HTMLPath, 'utf8'));
                    var data = {"guestname":session.guestname, "name": session.userid,"roomName":row.Roomname,"roomOwner":row.Roomowner,"movieName":row.Moviename,"moviePath":row.Path};
                    var result = template(data);
                    res.send(result)
                    
                }
                else{
                    session.path = 1;
                    //res.send("<script>localStorage.setItem('roomOwner',"+"'"+row.Roomowner+"'"+" );localStorage.setItem('roomName',"+"'"+row.Roomname+"'"+" ); localStorage.setItem('movieName',"+"'"+row.Moviename+"'"+" ); localStorage.setItem('moviePath',"+"'"+row.Path+"'"+" ); location.replace('/"+""+roomusername+""+"/movieroom/"+""+row.Roomname+"'"+");</script>");
                    res.send("<script>location.replace('/"+""+roomusername+""+"/movieroom/"+""+row.Roomname+"'"+");</script>");
                }
            }
            else if (session.roompassword == row.Roompassword) 
            {

                let HTMLPath = path.join(__dirname, './templates/registered/videoplayer.html');
                var template = Handlebars.compile(fs.readFileSync(HTMLPath, 'utf8'));
                var data = { "guestname":session.guestname,"name": session.userid,"roomName":row.Roomname,"roomOwner":row.Roomowner,"movieName":row.Moviename,"moviePath":row.Path};
                var result = template(data);
                res.send(result)
                
                
            }
            else{

                  RoomName = row.Roomname;
                  
                  //res.send("This room is private, you must know the password. Good luck")
                  res.send("<script>localStorage.setItem('roomOwner',"+"'"+row.Roomowner+"'"+" ); localStorage.setItem('roomName',"+"'"+RoomName+"'"+" ); localStorage.setItem('moviePath',"+"'"+row.Path+"'"+" ); location.replace('/privateroom/');</script>"); //Tuleks ära muuta

              }

              
          }
       
    });
 
}
else{

   // res.redirect("/unregistered/");
    res.send("<script> localStorage.setItem('roomOwner',"+"'"+roomusername+"'"+" ); localStorage.setItem('roomName',"+"'"+room+"'"+" ); location.replace('/unregistered/');</script>");

}
        
});

//router.get("/publicroom/",function(req,res){
//    session = req.session;
//    session.path = 1;
//    console.log("testing")
//    res.sendFile("./templates/registered/videoplayer.html",{root:__dirname});
//});

//router.get("/privateroomowner/",function(req,res){
//    res.sendFile("./templates/registered/videoplayer.html",{root:__dirname});
//});

router.get("/privateroom/",function(req,res){
    session = req.session;

    if(session.userid||session.guestname){
        session.roompassword = 0;
        res.sendFile("./templates/registered/privateroompassword.html",{root:__dirname});

    }
    else{
        res.redirect("/login/")
    }
});


router.get("/uploads/:name/:mode/:folder/:video/",function(req,res){
    name = req.params.name;
    mode = req.params.mode;
    folder = req.params.folder;
    video = req.params.video;
    res.sendFile("./uploads/"+name+"/"+mode+"/"+folder+"/"+video,{root:__dirname});

});
router.get("/unregistered/",function(req,res){
    session = req.session;
    res.sendFile("./templates/unregistered/remindertologin.html",{root:__dirname});

});

router.get("/profile/:user/",function(req,res){
    session = req.session
    name = req.params.user
    $query = 'SELECT * FROM flask WHERE Username =' +  connection.escape(name);
    connection.query($query, function(err, rows, fields) {
        if(err){
            console.log("An error ocurred performing the query (Profile find).");
            return;
        }
        console.log("Profile find query succesfully executed");
        if(rows.length != 0){
            if(session.userid){
                if(session.userid == name){
        
                    let HTMLPath = path.join(__dirname, './templates/registered/profile.html');
                    var template = Handlebars.compile(fs.readFileSync(HTMLPath, 'utf8'));
                    var data = { "name":session.userid,"profilename": name,"dec":"This is my profile"};
                    var result = template(data);
                    res.send(result)
                }
                else{
                    let HTMLPath = path.join(__dirname, './templates/registered/profile.html');
                    var template = Handlebars.compile(fs.readFileSync(HTMLPath, 'utf8'));
                    var data = { "name":session.userid,"profilename": name,};
                    var result = template(data);
                    res.send(result)
                }
            }
            else{
                let HTMLPath = path.join(__dirname, './templates/unregistered/limitprofile.html');
                var template = Handlebars.compile(fs.readFileSync(HTMLPath, 'utf8'));
                var data = { "name": name,};
                var result = template(data);
                res.send(result)
            }
        }
        else{
            res.send("this profile does not exist")
        }
       
    });
    
   
})

//logout//

router.get("/logout/",function(req,res){
    req.session.destroy();
    res.redirect('/');


});





module.exports = router;
