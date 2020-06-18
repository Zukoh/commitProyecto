const express = require("express");
const path = require("path");
const expHbs = require("express-handlebars");
const bodyParser = require("body-parser");

const valid = require("./valid");

const app = express();

app.set("view engine", "handlebars");

app.engine("handlebars", expHbs({
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views/layouts")
}));

app.set("views", path.join(__dirname, "views"));

// Ruta base de recursos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Body Parser para Content-Type "application/x-www-form-urlencoded"
app.use(bodyParser.urlencoded({ extended: true }));

// Landing page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"))
});

// Página de registro
app.get("/register", (req, res) => {
  res.render("register", { layout: "logeos" });
});

// Endpoint que registra user nuevx
app.post("/register", (req, res) => {
  // 1. Validar datos de registro
  valid.getUser(req.body.user, result => {

    // Si no se pudo consultar a la DB renderizo signup con mensaje de error
    if (!result.success) {
      res.render("register", {
        layout: "logeos",
        message: {
          class: "failure",
          text: "Sorry, can't register now, retry later."
        }
      });
      return;
    }

    // Si el usuario ya existe renderizo signup con mensaje de error
    if (result.user) {
      res.render("register", {
        layout: "logeos",
        message: {
          class: "failure",
          text: "Disculpe, el usuario ya esta en uso.."
        }
      });
      return;
    }

    // Si el password está mal ingresado renderizo signup con mensaje de error
    if (!req.body.pass || req.body.pass !== req.body.passRepeat) {
      res.render("register", {
        layout: "logeos",
        message: {
          class: "failure",
          text: "Las contraseñas que escribio no coinciden.."
        }
      });
      return;
    }

    // Procesamos alta de usuarix
    valid.registerUser(req.body.user, req.body.pass, req.body.dni, req.body.edad, req.body.reserva, req.body.local, result => {

      if (result) {

        // Si se pudo registrar renderizo login con mensaje de éxito
        res.render("login", {
          layout: "logeos", message: {
            class: "success",
            text: "Usuario registrado con exito."
          }
        });

      } else {

        // Si no se pudo registrar renderizo signup con mensaje de error
        res.render("register", {
          layout: "logeos",
          message: {
            class: "failure",
            text: "Disculpe no pudimos registrar al usuario, intente mas tarde."
          }
        });

      }

    });


  });

});

app.get("/login", (req, res) =>{
  res.render("login", { layout: "logeos" });
})

app.get("/eventos", (req, res) =>{
  res.render("eventos", { layout: "main" })
})





app.get("/boliches", (req, res) =>{
  res.render("boliches", { layout: "main" })
})

app.get("/canchas", (req, res) =>{
  res.render("canchas", { layout: "main" })
})

app.get("/local", (req, res) =>{
  res.render("local", { layout: "main" })
})
app.get("/home", (req, res)=>{
 
  valid.dameLocales("Los Maizales", result =>{
    
    if (result.valid){
      
      res.render("home", {
        layout: "main", 
        local: {
          nombre: result.nombre,
          direccion: result.direccion,
          precioreserva: result.precioreserva,
          dispDias:result.dispDias,
          dispHoras:result.dispHoras
      }
    })
    }
    else{
      res.render("home", {
        layout: "main", 
        local: {
          nombre: "Los Maizales",
          direccion: "Aguero 1224",
          precioreserva: "580",
          dispDias:"Lunes a Viernes",
          dispHoras:"8 a 20."
      }
    })   
  }
})
})

app.get("/homelocal", (req, res)=>{
 
  valid.dameReservas("Los Maizales", result =>{
    
    if (result.valid){
      
      res.render("homelocal", {
        layout: "main", 
        reserva: {
            nombre: result.nombre,
            hora: result.hora,
            montopagado:result.montopagado,
            cantidad:result.cantpersonas
      }
    })
    }
    else{
      res.render("homelocal", { layout: "main",  } )   
  }
})
})

app.get("/reservar", (req, res)=>{
  res.render("reservar", {layout: "main"})
  
})


app.get("/reservar2", (req, res)=>{
  res.render("reservar2", {layout: "main"})
  
})
app.get("/reservar3", (req, res)=>{
  res.render("reservar3", {layout: "main"})
  
})
app.get("/reservar4", (req, res)=>{
  res.render("reservar4", {layout: "main"})
  
})



// Endpoint que valida user/pass (form)
app.post("/login", (req, res) => {

  valid.login(req.body.user, req.body.pass, result => {

    if (result.valid) {
      // Renderizado de home con datos de personas
      if(result.msg === "reserva"){
      res.render("home", { layout: "main", message: result.msg })
      }
      else{
        res.render("local", { layout: "main", message: result.msg })
      }
    } else {
      // Se retorna el login con el error
      res.render("login", { layout: "logeos", message: result.msg });
    }

  });

});

app.post("/local", (req, res)=>{
  valid.postLocal(req.body.nombre, req.body.direccion, req.body.minReserva, req.body.diaDesde, req.body.horarios, result =>{
    if (result.valid){
      res.render("local", {
        layout: "main", 
        message: {
            class:"localpost",
            text: "Su local se guardo correctamente :)"
      }
    })
    }
  } )    
})

app.post("/reservar", (req, res)=>{
  valid.newReserva(req.body.nombre, req.body.montopag, req.body.cantpersonas, req.body.hora, result =>{
    if (result.valid){
      res.render("reservar", {
        layout: "main", 
        message: {
            class:"localpost",
            text: "Su reserva se guardo correctamente :)"
      }
    })
    }
  } )    
})



// Inicio del servidor
app.listen(5555, () => {
  console.log(`Servidor iniciado en http://localhost:5555/ ...`)
});
