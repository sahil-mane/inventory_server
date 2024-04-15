import express from 'express';
import cors from 'cors';
import { MongoClient, ServerApiVersion , ObjectId } from'mongodb';

const app = express()
const PORT = process.env.PORT || 5000

//Middleware
app.use(cors());
app.use(express.json());

//smooth12

app.get('/',(req ,res)=>{
    res.send("welcome to website ")
})

//mongodb configuration

const uri = "mongodb+srv://mern-book-store:smooth12@cluster0.j9ytnez.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // create a collection of document
    const bookCollections = client.db("BookInventory").collection("books");
    
    // insert a book to the db: post method
    app.post("/upload-book", async(req , res)=>{
        const data = req.body;
        const result = await bookCollections.insertOne(data);
        res.send(result);
    })

    //get all books from the database
    // app.get("/all-books", async(req , res)=>{
    //     const books = bookCollections.find();
    //     const result = await books.toArray();
    //     res.send(result);
    // })

    //update a book data : patch or update methods
    app.patch("/book/:id", async (req , res)=>{
      const id = req.params.id;
      const updateBookData = req.body;
      const filter = { _id : new ObjectId(id)};
      const updateDoc = {
        $set:{
          ...updateBookData
        },
      }
      const options = {upsert: true};
      const result = await bookCollections.updateOne(filter,updateDoc,options);
      res.send(result);
    })

    //delete a book data 
    app.delete( "/book/:id" , async (req ,res )=>{
      const id = req.params.id
      const filter = { _id : new ObjectId(id)};
      const result = await bookCollections.deleteOne(filter);
      res.send(result);
    })

    //find a category
    app.get("/all-books", async(req , res)=>{
      let query ={};
      if (req.query.category || req.query.authorName || req.query.bookTitle) {
        if (req.query.category) {
            query.category = req.query.category;
        }
        if (req.query.authorName) {
            query.authorName = req.query.authorName;
        }
        if (req.query.bookTitle) {
            query.bookTitle = req.query.bookTitle;
        }
    }
      const result = await bookCollections.find(query).toArray();
      res.send(result);
    })

    //to get single book data
    app.get( "/book/:id" ,async (req , res)=> {
      const id = req.params.id ;
      const filter = { _id : new ObjectId(id)};
      const result = await bookCollections.findOne(filter);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
   catch(e){
        console.error("Could not connect to the database. ", e);
   }
  finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }




app.listen(PORT,()=>{
    console.log(`Server is connected in PORT ${PORT}`)
})

//1:12:28 hrs:mins:sec