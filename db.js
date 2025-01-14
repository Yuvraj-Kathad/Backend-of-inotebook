const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://kathadyuvraj05:6B9rCiUbYe9SJW1H@local-database.u8p5l.mongodb.net/"

const connectToMongo = async() =>{
    // await mongoose.connect(mongoURI, {
    // });
    // console.log("Connected to mongo successsully!");
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB successfully!');
      } catch (error) {
        console.error('Error connecting to MongoDB:', error);
      }
}

module.exports = connectToMongo;