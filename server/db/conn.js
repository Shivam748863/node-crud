const mongoose = require("mongoose");
// const DB = process.env.DATABASE

const password = encodeURIComponent("Shivam@370");

// const uri = 'mongodb+srv://Shivam:Shivam@370@cluster0.tscmj3w.mongodb.net/mernyoutubeapp?retryWrites=true&w=majority&appName=Cluster0';
const uri = `mongodb+srv://Shivam:${password}@cluster0.tscmj3w.mongodb.net/mernyoutubeapp?retryWrites=true&w=majority&appName=Cluster0`;


mongoose
  .connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("database connected"))
  .catch((error) => {
    console.log(error);
  });
