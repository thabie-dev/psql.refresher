const supertest = require('supertest');
const PgPromise = require("pg-promise")
const express = require('express');
const assert = require('assert');
const fs = require('fs');
require('dotenv').config()

const API = require('./api');
const { default: axios } = require('axios');
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const DATABASE_URL = process.env.DATABASE_URL|| 'postgres://gary:gar123:@localhost:5432/garment_app';
const pgp = PgPromise({});
const db = pgp(DATABASE_URL);

// API(app, db);

const cors = require('cors')

const jwt = require('jsonwebtoken')

// import the dataset to be used here
const garments = require('./garments.json');
const postgres = require('postgres');

// const sql = postgres('postgres://username:password@host:port/database', {
//   host                 : 'localhost',            // Postgres ip address[s] or domain name[s]
//   port                 : 5432,          // Postgres server port[s]
//   database             : 'garment_app',            // Name of database to connect to
//   username             : 'gary',            // Username of database user
//   password             : 'gar123',            // Password of database user

// })

// enable the static folder...
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())



// API routes to be added here
// app.get('/api/garments', function(req, res){
//     // note that this route just send JSON data to the browser
//     // there is no template
//     res.json({garments});
// });

function checkToken(req, res, next) {

    const token = req.query.token
    console.log(token)


    console.log(req.body.token);


    const decoded = jwt.verify(token, 'QueenPresident@Mmabatho');


    const { username } = decoded;

    console.log(username);


    if (username && username === 'President') {
        next();
    } else {
        res.sendStatus(403);
    }

}

app.get('/api/garments',  function (req, res) {
    // let garments = await db.any(`select * from garment`)

    // const token = req.params.token
    // console.log(token)
    const gender = req.query.gender;
    const season = req.query.season;

    const filteredGarments = garments.filter(garment => {
        // if both gender & season was supplied
        if (gender != 'All' && season != 'All') {
            return garment.gender === gender
                && garment.season === season;
        } else if (gender != 'All') { // if gender was supplied
            return garment.gender === gender
        } else if (season != 'All') { // if season was supplied
            return garment.season === season
        }
        return true;
    });
    res.json({
        garments: filteredGarments
    });
});

app.get('/api/login', function (req, res) {
    var token = jwt.sign({ username: 'President' }, 'QueenPresident@Mmabatho');
    // console.log(token)

    var decoded = jwt.decode(token);
    // console.log(decoded)

    res.json({
        token
    });
});



// note that this route just send JSON data to the browser




app.get('/api/garments/price/:price', checkToken, function (req, res) {
    //   const garments = sql`
    //   select * from garment`
    console.log(garments)


    const maxPrice = Number(req.params.price);
    const filteredGarments = garments.filter(garment => {
        // filter only if the maxPrice is bigger than maxPrice
        if (maxPrice > 0) {
            return garment.price <= maxPrice;
        }
        return true;
    });

    res.json({
        garments: filteredGarments
    });
});

app.post('/api/garments',  (req, res) => {
    
    // get the fields send in from req.body
    const {
        description,
        img,
        gender,
        season,
        price
    } = req.body;

    // add some validation to see if all the fields are there.
    // only 3 fields are made mandatory here
    // you can change that

    if (!description || !img || !price) {
        res.json({
            status: 'error',
            message: 'Required data not supplied',
        });
    } else {

        // you can check for duplicates here using garments.find

        // add a new entry into the garments list
        garments.push({
            description,
            img,
            gender,
            season,
            price
        });

        res.json({
            status: 'success',
            message: 'New garment added.',
        });
    }

});



//});

function filterData() {
    axios.get(`/api/garments?gender=${genderFilter}&season=${seasonFilter}`)
        .then(function (result) {
            searchResultsElem.innerHTML = garmentsTemplate({
                garments: result.data.garments
            })
        });
}


// });

const PORT = process.env.PORT || 4017;
app.listen(PORT, function () {
    console.log(`App started on port ${PORT}`)

});

