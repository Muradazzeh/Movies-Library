`use strict`
const express = require('express');
const { handle } = require('express/lib/application');
const app = express();
const port = 3000;

const moveData =require("./data.json")
function Moves(title, poster, summary) {
    this.title = title;
    this.poster = poster;
    this.summary = summary;
   
}


app.get("/favorite",handleRouteFav)
function handleRouteFav(req,res){
    res.send("Welcome to Favorite Page")
}
app.get("/",handleRouteData)
function handleRouteData(req,res){
    let result=[];
    let newMove= new Moves (moveData.title,moveData.poster_path,moveData.overview)
    result.push(newMove);
    res.json(result).send("<h1> Main<h1>")
}
app.all('*', handleErorr) 
    function handleErorr(req,res){
        res.status(404).send('<h1>404! Page not found</h1>');
    }
    app.use(function(err, req, res, next) {
        return res.status(500).send({ error: err });
      });
    // app.use('/error',handleServerEr) 
    // function handleServerEr(req, res)  {
    //  res.status(500)
    // }
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})