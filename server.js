`use strict`
const express = require('express');
const { handle } = require('express/lib/application');

const cors=require("cors");
const axios = require("axios").default;
require('dotenv').config()
const port = 3000;
const app = express();
// const apiKey=process.env.APIKEY;
app.use(cors());
const moveData =require("./data.json")
function Moves(title, poster, summary) {
    this.title = title;
    this.poster = poster;
    this.summary = summary;
   
}


app.get("/",handleRouteData)
app.get("/favorite",handleRouteFav)
app.get("/trending",handleTrending)
app.get("/search",handleSearch)
app.get("/newComingMovies",handlenewComingMovies )
app.get("/popular",handlePopular)
app.all('*', handleErorr) 
// app.use(function(err, req, res, next) {
//     return res.status(500).send({ error: err });
//   });

  //// favorite page
function handleRouteFav(req,res){
    res.send("Welcome to Favorite Page")
}
//// main page 
function handleRouteData(req,res){
    let result=[];
    let newMove= new Moves (moveData.title,moveData.poster_path,moveData.overview)
    result.push(newMove);
    res.json(result).send("<h1> Main<h1>")
}
//// error 404
    function handleErorr(req,res){
        res.status(404).send('<h1>404! Page not found</h1>');
    }
  
//// trinding 

function Moves2(ID, Title, rleasDate,details) {
    this.ID = ID;
    this.titl = Title;
    this.rleasDate = rleasDate;
    this.details=details;
}


function handleTrending (req,res){
    const url=`https://api.themoviedb.org/3/trending/all/week?api_key=b7402cd7dc9fc4ef5aeb658c2a0044e7&language=en-US`
    axios.get(url)
    .then(outPut =>{
        let trendMove= outPut.data.results.map(Element =>{
            return new Moves2(Element.id,Element.title,Element.release_date,Element.overview)
        })
        res.json(trendMove)
        // res.send("hlooooooo")
        // console.log(outPut)
        // console.log(outPut.data.results)
    })
    .catch(error =>{
        console.log(error)
    })

}

function handleSearch(req,res){
    console.log(req.query)
    let moveName=req.query.home
    let url=`https://api.themoviedb.org/3/search/movie?api_key=b7402cd7dc9fc4ef5aeb658c2a0044e7&language=en-US&query=${moveName}&page=2`
axios.get(url)
.then(outPut =>{
    res.json(outPut.data.results)
})
.catch();
}
function Moves3(name,reviw) {
    this.name = name;
    this.rev = reviw;
   

}
function handlenewComingMovies (req,res){
    const url=`https://api.themoviedb.org/3/movie/upcoming?api_key=b7402cd7dc9fc4ef5aeb658c2a0044e7&language=en-US&page=1`
    axios.get(url)
    .then(outPut =>{
        let newMove= outPut.data.results.map(Element =>{
            return new Moves3(Element.title,Element. overview,)
        })
        res.json(newMove)
        // res.send("hlooooooo")
        console.log(outPut)
        console.log(outPut.data.results)
    })
    .catch(error =>{
        console.log(error)
    })

}

function Moves4(Name, popularty, votes,rev) {
    this.name = Name;
    this.popular = popularty;
    this.votesAvg = votes;
    this.revew=rev;
}


function handlePopular (req,res){
    const url=`https://api.themoviedb.org/3/movie/popular?api_key=b7402cd7dc9fc4ef5aeb658c2a0044e7&language=en-US&page=1`
    axios.get(url)
    .then(outPut =>{
        let popMove= outPut.data.results.map(Element =>{
            return new Moves4(Element.title,Element. popularity,Element.vote_average,Element.overview)
        })
        res.json(popMove)
        // res.send("hlooooooo")
        // console.log(outPut)
        console.log(outPut.data.results)
    })
    .catch(error =>{
        console.log(error)
    })

}


   
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})