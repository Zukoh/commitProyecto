const express = require("express");
const app = express();
const path= require("path");

// Middleware para recursos estaticos

app.use(express.static(path.join(__dirname, "../client")));


app.get("/", (req,res)=>{
   res.sendFile(path.join(__dirname, "../client/index.html"))
});




app.listen("4444", () =>{
    console.log("Servidor corriendo en http://localhost:4444")
});

