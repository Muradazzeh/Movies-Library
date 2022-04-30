`use strict`
const passWord=process.env.Password
const url = `postgres://murad:${passWord}@localhost:5432/movies`
const port = 3000;
const express = require('express');
const { handle } = require('express/lib/application');

const cors=require("cors");
const axios = require("axios").default;
require('dotenv').config()

const app = express();
const bodyParser = require('body-parser')
const { Client } = require('pg')
const client = new Client(url)
const apiKey=process.env.APIKEY;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const moveData =require("./data.json")
function Moves(title, poster, summary) {
    this.title = title;
    this.poster = poster;
    this.summary = summary;
   
}
app.post("/addMovie",handleAdd)
app.get("/getMovies",handleGet)
app.get("/",handleRouteData)
app.get("/favorite",handleRouteFav)
app.get("/trending",handleTrending)
app.get("/search",handleSearch)
app.get("/newComingMovies",handlenewComingMovies )
app.get("/popular",handlePopular)
app.use('*', handleErorr) 
app.use(handleErr500)

///data base app
// app.post("/addMovie",handleAdd)
// app.get("/getMovies",handleGet)

///// data base function 

function handleAdd (req,res){
    console.log(req.body)
    // res.send("hlooooowe")
    const { title, review, duration, parts } = req.body;
    let sql= `INSERT INTO Movies(title, review, duration, parts) VALUES($1,$2,$3,$4)RETURNING*;`
    let value=[title, review, duration, parts]
    client.query(sql,value).then((result)=>{
        console.log(result.rows);
        return res.status(201).json(result.rows[0]);
    }).catch()

    
  

}

function handleGet(req,res){
    // res.status(201).send("hloooooowe")
    let sql = 'SELECT * from movies;'
    client.query(sql).then((result) => {
        console.log(result);
        res.json(result.rows);
    }).catch((err)=>{
        handleErr500(err,req,res)
    });
}


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
  /// error 500
  function handleErr500(error,req,res){
      res.status(500).send(error)
  }



//// trinding 

function Moves2(ID, Title, rleasDate,details) {
    this.ID = ID;
    this.titl = Title;
    this.rleasDate = rleasDate;
    this.details=details;
}


function handleTrending (req,res){
    const url=`https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US`
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
    let url=`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${moveName}&page=2`
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
    const url=`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`
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
    const url=`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
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


   
client.connect().then(() => {

    app.listen(port, () => {
        console.log(`Server is listening ${port}`);
    });
})