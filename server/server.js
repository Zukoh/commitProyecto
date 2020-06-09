const express = require("express");
const app = express();
const path= require("path");
const bodyParser = require ("body-parser");

// Middlewares 
app.use(express.static(path.join(__dirname, "../client")));
app.use(bodyParser.json());

let userList = [];

app.get("/", (req,res)=>{
   res.sendFile(path.join(__dirname, "../client/index.html"));
});

app.get("/login", (req, res) =>{
    res.sendFile(path.join(__dirname, "../client/login.html"));
})

app.post("/login", (req, res) => {
    if(!req.body){
        res.status(400).send("No se encontraron datos..");
        return;
    }
    if(!req.body.username || !req.body.password ){
        res.status(400).send("No se recibieron datos..");
        return;
    }
    
    const foundUsers= userList.filter(user => user.username === req.body.username);
    if (foundUsers.length > 0){
        const user = foundUsers[0];
        if(user.password === req.body.password ){
            res.status(200).send("logeado");
        } else{
            res.status(400).send("La contraseña no coincide");
        }
    }else{
             res.status(400).send("no existe el usuariio");
        }
    
    
});
app.get("/register", (req, res) =>{
    res.sendFile(path.join(__dirname, "../client/register.html"));
})

app.post("/register", (req, res) =>{
    if(!req.body){
        res.status(400).send("No se encontraron datos");
        return;
    }
    if(!req.body.username || !req.body.password){
        res.status(400).send("No se econtraron los datos recibidos");
        return;
    }


    // Si recibi los datos:

    userList.push({
        username: req.body.username,
        password: req.body.password,
        mail : req.body.mail,
        dni : req.body.dni,
        edad : req.body.edad,
        tipouser : req.body.tipouser,
        tipouser2 : req.body.tipouser2
    });
    
    res.status(200).send("usuarix registradx");
});









app.listen("4444", () =>{
    console.log("Servidor corriendo en http://localhost:4444")
});

