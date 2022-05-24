module.exports = function (app, db) {

    app.get('/api/test', function (req, res) {

        res.json({

            name: 'joe',

        });

    });



    app.get('/api/garments', async function (req, res) {

        const { gender, season } = req.query;
        let garments = await db.any(`select * from garment`)
        if (season) {
            garments = await db.any(`select * from garment where season=$1`, season)
        }
         if (gender){
             garments = await db.any(`select * from garment where gender=$2`, gender)
         }
         console.log(garments)
         
        // let garments = [];

        // add some sql queries that filter on gender & season

        const conditions =

            !gender && !season

                ? ''

                : `where ${gender ? `gender='${gender}'` : ''} ${gender && season ? 'and' : ''

                } ${season ? `season='${season}'` : ''}`;



        garments = await db.any(`select * from garment ${conditions}`);



        res.json({

            data: garments,

        });

    });



    app.put('/api/garment/:id', async function (req, res) {

        try {

            // use an update query...



            const { id } = req.params;

            const data = { ...req.body };

            const fields = Object.keys(data);

            let updates = [];

            for (const field in data) {

                if (fields.includes(field)) {

                    updates = [...updates, `${field} = '${data[field]}'`];

                }

            }

            await db.none(`update garment set ${updates.toString()} where id=$1`, id);



            //const garment = await db.oneOrNone(`select * from garment where id = $1`, [id]);



            // you could use code like this if you want to update on any column in the table

            // and allow users to only specify the fields to update



            // let params = { ...garment, ...req.body };

            // const { description, price, img, season, gender } = params;



            res.json({

                status: 'success',

            });

        } catch (err) {

            console.log(err);

            res.json({

                status: 'error',

                error: err.message,

            });

        }

    });



    app.get('/api/garment/:id', async function (req, res) {

        try {

            const { id } = req.params;

            // get the garment from the database

            const garment = await db.one(`select * from garment where id=$1`, id);



            res.json({

                status: 'success',

                data: garment,

            });

        } catch (err) {

            console.log(err);

            res.json({

                status: 'error',

                error: err.message,

            });

        }

    });



    app.post('/api/garment/', async function (req, res) {

        try {

            const { description, price, img, season, gender } = req.body;



            // insert a new garment in the database



            await db.none(

                'insert into garment (description, price, img, season, gender) values ($1,$2,$3,$4,$5) on conflict do nothing',

                [description, price, img, season, gender],

            );



            res.json({

                status: 'success',

            });

        } catch (err) {

            console.log(err);

            res.json({

                status: 'error',

                error: err.message,

            });

        }

    });



    app.get('/api/garments/grouped', async function (req, res) {

        const result = await db.many(

            `select gender, count() from garment group by gender order by count() asc`,

        );

        // use group by query with order by asc on count(*)

        res.json({

            data: result,

        });

    });



    app.delete('/api/garments', async function (req, res) {

        try {

            const { gender } = req.query;

            // delete the garments with the specified gender

            await db.none(`delete from garment where gender = $1`, gender);

            res.json({

                status: 'success',

            });

        } catch (err) {

            // console.log(err);

            res.json({

                status: 'success',

                error: err.stack,

            });

        }

    });

};