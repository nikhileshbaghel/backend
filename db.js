const mongoose = require("mongoose");

const dburl = process.env.DB_URL;

const mongoURI = "mongodb://localhost:27017/inotebook?readPreference=primary&appname=MongoDB%20Compass&ssl=false";

 //const mongoURI =   "mongodb+srv://i-notebook-safe:nikhilesh123@cluster0.md4jfoz.mongodb.net/?retryWrites=true&w=majority"; //change for localhost

//const mongoURI = dburl;

// const connectToMongo = ()=> {
//     mongoose.connect(mongoURI,{
//         useNewUrlParser : true,
//         useUnifiedTopology:true
//     })
// }
const connectToMongo = () => {
  mongoose.connect(
    mongoURI,
    {
      useNewUrlParser: true,

      useUnifiedTopology: true,
    },
    (err) => {
      if (err) throw err;
      console.log("Connected to MongoDB!!!");
    }
  );
};

// const connectToMongo = () => {

// mongoose.connect(mongoURI, {
//   userNewUrlPaser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
// })
//   .then(() => {
//     console.log('Connected to MongoDB');
//   })
//   .catch((e) => {
//     console.log('not connected');
//   });

// }

//console.log(dburl);

module.exports = connectToMongo;
