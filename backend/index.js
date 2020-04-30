const keys = require("./keys");
const express = require('express');
const app = express();
const bodyParser = require("body-parser")
app.use(bodyParser.json());

const redis = require("redis");
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
})

pgClient.on('error', () => console.log('No connection to PG DB'));

pgClient.query('CREATE TABLE IF NOT EXISTS history(profit VARCHAR)').catch(err =>{ 
  console.log(err);
});

const countPizzaProfit = function(radius, price){
  // price/value ratio per 1m^2 of pizza
  return (price/(Math.PI*(radius**2)))*10000
}
app.get("/:radius/:price", (req, resp) => {
  const key = `${req.params.radius}&${req.params.price}`;
  const radius = req.params.radius;
  const price = req.params.price;

  if (isNaN(radius)) {
    return resp.send({error: "Radius must be a number!"});
  }  
  if (isNaN(price)) {
    return resp.send({error: "Price must be a number!"});
  }
  if(radius<0){
    return resp.send({error: "Pizza size can't be negative!"});
  }
  if(radius==0){
    return resp.send({error: "There is no pizza! (╯°□°）╯︵ ┻━┻"});
  }
  if(price<0){
    return resp.send({error: "Pizza price can't be negative!"});
  }
  redisClient.get(key, (err, profitability) => {
      if(!profitability) {
        profitability = countPizzaProfit(radius, price);
        redisClient.set(key, profitability);
      }
      pgClient.query('INSERT INTO history(profit) VALUES ($1);', [profitability]).catch(err => console.log(err));
      profitability= Number(profitability).toFixed(3);
      resp.send({result: profitability})
  });

});



app.get("/history/", (req, resp) => {
  pgClient.query("SELECT * FROM history", (err,res) => {
      if (err) {
          console.log(err.stack, res);
          resp.send('Error occured when reading from db\n'+err.stack);
      } else {
          resp.send(res.rows);
      }
  });
});
// app.get('/dbinit', function (req, res) {
//   res.send({keys})
  
// });//for debug purposes

// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });

app.listen(4000,  err => {
  console.log('Example app listening on port 4000!');
});
