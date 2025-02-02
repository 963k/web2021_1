const express = require("express");
const app = express();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test2.db');

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  const message = "こんにちは";
  res.render('show', {mes:message});
});

app.get("/db", (req, res) => {
    db.serialize( () => {
        db.all("select animefilm.id, animefilm.name, animefilm.income, maker.name as name2 from animefilm inner join maker on animefilm.maker_id=maker.id;", (error, row) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            res.render('select', {data:row});
        })
    })
})
app.get("/top", (req, res) => {
    console.log(req.query.pop);    // ①
    let desc = "";
    if( req.query.desc ) desc = " desc";
    let sql = "select animefilm.id, animefilm.name, animefilm.income, maker.name as name2 from animefilm inner join maker on animefilm.maker_id=maker.id" + desc + " limit " + req.query.pop + ";";
    console.log(sql);    // ②
    db.serialize( () => {
        db.all(sql, (error, data) => {
            if( error ) {
                res.render('show', {mes:"エラーです"});
            }
            console.log(data);    // ③
            res.render('select', {data:data});
        })
    })
})

app.get("/db/:id",(req,res)=>{
  db.serialize(()=>{
    db.all("select id,name,income,maker_id from animefilm where id = " + req.params.id + ";",(error,row)=>{
      if(error){
        res.render('show',{mes:"エラーです"});
      }
      res.render('db',{data:row});
    })
  })
})





app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.post("/insert",(req,res)=>{
  let sql=`
insert into example (name,income,maker)values("`+req.body.name +`",`+ req.body.income +`,`+req.body.maker +`);`
  console.log(sql);
  db.serialize(()=>{
    db.run(sql,(error,row)=>{
      console.log(error);
      if(error){
        res.render('show',{mes:"エラーです"});
      }
      res.redirect('/db');
      });
    });
  console.log(req.body);
})

app.use(function(req, res, next) {
  res.status(404).send('ページが見つかりません');
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
