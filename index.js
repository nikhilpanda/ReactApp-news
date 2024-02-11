const express = require('express');
const request = require('request');
const stories = require('./stories');

const app = express();

app.use((req,res,next)=> {
    console.log("Request Details: Method:",req.method,"Original URL:", req.originalUrl);
    next();
});   //Output is Method:get & originalURL: /stories/is (depending on URL you put the request to)

// app.use((req,res,next) => {
//     res.header("Access-Control-Allow-Origin","*");

//     next();
// });

app.get('/ping',(req,res) =>res.send('pong'));

app.get('/stories',(req,res)=>{
    res.json(stories)
});

app.get('/stories/:title',(req,res) =>{
    const {title} = req.params;
    res.json(stories.filter(story =>story.title.includes(title)));
});  

app.get(("/topstories"),(req,res,next) => {
    request({url:"https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty"},
    (error,response, body) => {
        if(error || response.statusCode !== 200) {
           return next(new Error('Error requesting top stories'));
        }
        res.json(JSON.parse(body));
    })
});

app.use((err,req,res,next) => {
    console.log("Error Message:",err);

    res.status(500).json({
        type:'error',
        message: err.message
    });
})

const PORT = 3000;
app.listen(PORT, ()=> console.log(`listening to ${PORT}`));


