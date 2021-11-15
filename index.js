const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const ObjectId = require('mongodb').ObjectId;

const app = express();
const port =  process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gqp1q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        
        const database = client.db('AppartmentHunt');
        const appartmentsCollection = database.collection('Appartments');
        const bookingsCollection = database.collection('bookings');
        const usersCollection = database.collection('users');
        const reviewsCollection =database.collection('reviews');
        
        //get appartments api declaration
        app.get('/appartments', async(req, res)=>{
            const cursor = appartmentsCollection.find({});
            const appartments = await cursor.toArray();
            console.log('hitting appartments');
            res.send(appartments);
        })
        
        // delete appartement api
        app.delete('/appartments/:id', async(req, res)=>{
            const id = req.params.id;
            const query = { _id:ObjectId(id)}

            const result= await appartmentsCollection.deleteOne(query);
            console.log(id);
            res.json(result);
        })
        //newbooking get api collecition
        app.get('/bookings', async(req, res)=>{

            const cursor = bookingsCollection.find({});
            const bookings = await cursor.toArray();
            console.log("hitting the bookings", req.body);
            res.send(bookings);
        })

        //newbooking post api
        app.post('/bookings', async (req, res) => {
            const newBooking = req.body;
            const result = await bookingsCollection.insertOne(newBooking);


            console.log('hitting the booking', req.body);
            res.json(result);
          })

          //Delete API
        app.delete('/bookings/:id', async(req, res)=>{
            const id = req.params.id;
            const query = { _id:ObjectId(id)}

            const result= await bookingsCollection.deleteOne(query);
            console.log(id);
            res.json(result);
        })
        //update status api
        app.put('/bookings/:id', async(req, res)=>{
            const id = req.params.id;

            const statusChanged = req.body;
            const query = { _id:ObjectId(id)}
            const updateDoc ={
                $set:{
                    status: statusChanged.status
                }
            }
            const result = await bookingsCollection.updateOne(query, updateDoc)
            console.log(result);
            
            res.json(result)
        })

       // get single appartment
        app.get('/appartments/:id', async(req, res)=>{
            
            const id = req.params.id;
            console.log('hitting the id', id); 
            const query ={ _id: ObjectId(id) };

            const appartment = await appartmentsCollection.findOne(query);
            res.json(appartment);
        })


        //post appartments api declaration
        app.post('/appartments', async (req, res) => {
            const newAppartment = req.body;
            const result = await appartmentsCollection.insertOne(newAppartment);


            console.log('hitting the appartment', req.body);
            res.json(result);
          })


          //get users api
          app.get('/users/:email', async(req, res)=>{
              const email = req.params.email;
              const query = {email: email};
              const user = await usersCollection.findOne(query);
              let isAdmin = false;
              if (user?.role === "admin"){
                  isAdmin = true;
              }
              res.json({admin: isAdmin});
          })


          //post users api
          app.post('/users', async(req, res) =>{
              const newUser = req.body;
              const result = await usersCollection.insertOne(newUser);

              res.json(result);
          })

          //put the api
          app.put('/users', async(req, res)=>{
              const user = req.body;
              const filter = {email: user.email, displayName: user.displayName};
              const options = { upsert:true};
              const updateDoc = {$set: user};
              const result = await usersCollection.updateOne(filter, updateDoc, options);
              console.log(result);
              res.json(result);
          })

          //make admin api
          app.put('/users/admin', async(req, res)=>{
              const user = req.body;
              console.log(user);
              const filter = { email: user.email};
              const updateDoc = { $set: {role: "admin"}};
              const result = await usersCollection.updateOne(filter, updateDoc);
              res.send(result);
          })


          //post reviews api
          app.post('/reviews', async(req, res) =>{
              const newReview = req.body;
              const result = await reviewsCollection.insertOne(newReview);

              res.json(result);
          })
          //get reviews api
          app.get('/reviews', async(req, res)=>{
            const cursor =reviewsCollection.find({});
            const reviews = await cursor.toArray();
            console.log('hitting rivews', req.body);
            res.send(reviews);
        })
        //   app.get('/users', async(req, res)=>{
        //     const cursor =usersCollection.find({});
        //     const users = await cursor.toArray();
        //     console.log('hitting users', req.body);
        //     res.send(users);
        // })

        
        
    

    }
    finally{
        // await client.close();

    }
}

run().catch(console.dir)



app.get('/', (req, res)=>{
    res.send('running my appartment file');
})
app.listen(port, ()=>{
    console.log('running appartment file', port)
})