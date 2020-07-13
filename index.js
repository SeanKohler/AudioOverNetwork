const express = require('express');
const app = express();
const ytdl = require('ytdl-core');
const yts = require( 'yt-search' );
const fs = require('fs');
const {exec} = require('child_process');
var nrc = require('node-run-cmd');
app.use(express.static(__dirname+'/website'));
app.use(express.json({ limit: '10mb'}));
var data;
var url="";
var logs=[];
var cache={
    name: [],
    url: [],
    seconds: []
}
var alreadyAPIcalled =false;
var cacheIndex;


app.listen(3000, console.log('Server is Listening in 3000'));

app.get("/", function(req,res){
    //res.sendFile(path.join(__dirname+ '/index.html'));
    //res.sendFile("page.html");
    //res.sendFile("index.php");
});


app.post("/index.html", (req,res)=>{
    data=req.body.input;
    console.log(data)
    logs.push(data);
    play(logs[0])    
})


function play(str){
    if(str==undefined||str=="--endquery--"){
        console.log("now out of loop");
    }else{
    str=str.trim();
    alreadyAPIcalled=false;
    for(var i=0; i<cache.name.length; i++){
        //console.log("Does "+str+" = "+cache.name[i]);
        cache.name[i]=cache.name[i].trim();
        if(str==cache.name[i].toString()){
            //console.log("YES!");
            alreadyAPIcalled=true;
            cacheIndex=i;
        }
    }
    if(alreadyAPIcalled==true){
        alreadyCalled(str)
    }else{

        yts( str, function ( err, r ) {
            if(err){
                if(logs[0]==undefined){
                    //message.channel.send("!stop");
                }
                play(str);
                throw err;
            }else{
            //message.channel.send(r.videos[0].url);
            //console.log(r);
                
            if(r.videos[0]==undefined){
                //setTimeout(play,1000*2,message,str);
                play(str);
                //message.channel.send("!play "+str)
                //message.channel.send("!play "+str);
               // message.reply("Undefined :/")
                //message.channel.send("Please try again");
                if(firstplay==true){
                    var num= Math.floor(Math.random()*flavortext.length);
                    //message.channel.send(flavortext[num]);
                    console.log("--------------------------------");
                    console.log("undefined in function play ");
                    console.log("Attempting to play: "+str);
                    //console.log("Playing in Server: "+message.guild.name);
                    console.log("--------------------------------\n");
                    firstplay=false;   
                    
                }
                
            }else{
                cache.seconds.push(r.videos[0].seconds);
                cache.url.push(r.videos[0].url);
                cache.name.push(str);
                console.log("Added to cache");
                //console.log("NAME[0] "+cache.name[0]);
                //console.log("URL[0] "+cache.url[0]);
                //console.log("NAME[1] "+cache.name[1]);
                //console.log("URL[1] "+cache.url[1]);
                //console.log("NAME[2] "+cache.name[2]);
                //console.log("URL[2] "+cache.url[2]);
                play(str);
            }
        
    }
})
    }
}
}

function alreadyCalled(str){
    if(str=="--endquery--"){
        //message.channel.send("!stop");
    }else{
    console.log("Already called!");
    
    seconds=cache.seconds[cacheIndex];
    url=cache.url[cacheIndex];
    var author = "AON (Audio Over Network)"
    //addtoHistory(str,url,seconds,author);
    
    if(logs[0]!="--endquery--"){
        //message.channel.bulkDelete(1);
        inqueue=false;
        ytdl(url).pipe(fs.createWriteStream('audio.mp3')).on("finish",()=>{
            console.log("DONE DOWNLOADING");
            exec("omxplayer -o alsa audio.mp3")
        //exec("start wmplayer C:\Users\kohls\Desktop\NetworkAudio\audio.mp3", (err, outs, errs) => {
        //    console.log(outs);
        //});
        //nrc.run("start wmplayer C:\Users\kohls\Desktop\NetworkAudio\audio.mp3")
        logs.shift();
        setTimeout(play,1000*seconds,logs[0]);
        //play(logs[0]);
        
        //start wmplayer C:\Users\kohls\Desktop\NetworkAudio\audio.mp3
        //C:\Users\kohls\Desktop\NetworkAudio\audio.mp3
        
    });
}else{
    for(var i=0; i<logs.length; i++){
        console.log("Removing: "+logs[i]+" From the queue");
        logs.shift();
    }
}

}
}