const mongodb = require("mongodb");
const mongoURL = "mongodb+srv://zukito:argentina2254@cluster0-tu8na.mongodb.net/proyecto?retryWrites=true&w=majority";

/**
 * Función que valida user/pass. Retorna un objeto con un boolean que indica si las credenciales
 * son válidas y un string con un mensaje para errores.
 * 
 * @param {string} user Username
 * @param {string} pass Password
 * @param {function} cbResult Callback: function(result: { valid: boolean, msg: string })
 */
const login = (user, pass, cbResult) => {
  // Nos conectamos al servidor de MongoDB
  mongodb.MongoClient.connect(mongoURL, (err, client) => {

    if (err) {

      // Si no me pude conectar al server, retorno el false con un mensaje apropiado para el front
      cbResult({
        valid: false,
        msg: "Sorry, site is under maintenance now, retry later."
      });

    } else {

      const proyectoDB = client.db("proyecto");
      const usersCollection = proyectoDB.collection("users");

      usersCollection.findOne({ user: user, password: pass }, (err, foundUser) => {

        if (err) {

          // Si no pude consultar la colección, también retorno false con un mensaje, pero
          // lo hago ligeramente diferente al anterior para poder distinguir errores.
          cbResult({
            valid: false,
            msg: "Sorry, the site is under maintenance now, retry later."
          });

        } else {

          // Si pude consultar los datos, valido si encontré esa combinación usr/pwd o no.
          if (!foundUser) {
            cbResult({
              valid: false,
              msg: "Invalid user/password."
            });
          } else {
            // Si valida ok, me fijo que tipo de usuario es para saber que renderizar
            if(foundUser.userReserva === "on"){
              cbResult({
                valid: true,
                msg: "reserva"
              });
            }else{
            cbResult({
              valid: true,
              msg:"local"
            });
          }
          }

        }

        client.close();
      });

    }

  });
}

/**
 * Función que consulta usuarix en la DB y retorna los datos
 * 
 * @param {string} username Nombre de usuarix
 * @param {function} cbResult Callback: function(result: {
 *  success: boolean,
 *  user: {
 *    user: string,
 *    password: string
 *  }
 * })
 */
const getUser = (username, cbResult) => {

  mongodb.MongoClient.connect(mongoURL, (err, client) => {

    if (err) {

      cbResult({
        success: false
      });

    } else {

      const proyectoDB = client.db("proyecto");
      const usersCollection = proyectoDB.collection("users");

      usersCollection.findOne({ user: username }, (err, result) => {

        if (err) {
          cbResult({
            success: false
          });
        } else {
          cbResult({
            success: true,
            user: result
          });
        }

        client.close();

      });

    }

  });

}

/**
 * Función que registra nuevx usuarix (asume username y password validados)
 * 
 * @param {string} username Username
 * @param {string} password Password
 * @param {function} cbResult Callback: function(result: boolean)
 */
const registerUser = (username, password, dni, edad, userReserva, userLocal, cbResult) => {
  mongodb.MongoClient.connect(mongoURL, (err, client) => {

    if (err) {

      // Si hay error de conexión, retornamos el false
      // (no cerramos conexión porque no se logró abrir)
      cbResult(false);

    } else {

      const proyectoDB = client.db("proyecto");
      const usersCollection = proyectoDB.collection("users");

      const newUser = {
        user: username,
        password: password,
        dni: dni,
        edad: edad,
        userReserva: userReserva,
        userLocal: userLocal,
      };

      // Insertamos el user en la DB
      usersCollection.insertOne(newUser, (err, result) => {
        
        if (err) {
          cbResult(false);
        } else {
          cbResult(true);
          // console.log(result);
        }

        client.close();
      });

    }

  });
}


const postLocal = (nombre, dir, preserva, dispDias, dispHoras, cbR) =>{
  //Me conecto a mongoDB
  mongodb.MongoClient.connect(mongoURL, (err, client) =>{
    if(err){
      cbR({
        valid:false,
        msg:"No pudimos acceder en este momento intente mas tarde.."
      })
    } else {
      
      const proyectoDB = client.db("proyecto");
      const localCol = proyectoDB.collection("locales");

      const newLocal = {
        nombre: nombre,
        direccion: dir,
        precioreserva: preserva,
        dispDias: dispDias,
        dispHoras : dispHoras
      };

      localCol.insertOne(newLocal, (err, resultado) =>{
        if (err){
          cbR({
            valid:false,
            msg:"No pudimos guardar el local en este momento"
          });
        } else{
            cbR({
              valid:true,
              msg: "Se guardo correctamente los datos de tu local"
            });
        } 
        client.close();
      })
    }
  })
}

const newReserva = (nombre, montopag, cantpersonas, hora, cbR) =>{
  //Me conecto a mongoDB
  mongodb.MongoClient.connect(mongoURL, (err, client) =>{
    if(err){
      cbR({
        valid:false,
        msg:"No pudimos acceder en este momento intente mas tarde.."
      })
    } else {
      
      const proyectoDB = client.db("proyecto");
      const reservaCol = proyectoDB.collection("reservas");

      const newReserva = {
        nombre: nombre,
        montopagado: montopag,
        cantpersonas: cantpersonas,
        hora : hora,
        local: "Los Maizales"
      };

      reservaCol.insertOne(newReserva, (err, resultado) =>{
        if (err){
          cbR({
            valid:false,
            msg:"No pudimos guardar el local en este momento"
          });
        } else{
            cbR({
              valid:true,
              msg: "Se guardo correctamente los datos de tu reserva"
            });
        } 
        client.close();
      })
    }
  })
}

const dameReservas = (nombre, cbResult) => {
  mongodb.MongoClient.connect(mongoURL, (err, client) => {
    if (err) {
      
      cbResult({
        
        valid: false
      });
      
    } else {
      const proyectoDB = client.db("proyecto");
      const reservaCol = proyectoDB.collection("reservas");
      reservaCol.findOne({ local: nombre }, (err, result) => {
        if (err) {
         
          cbResult({
            valid: false
          });
        } else {
          if(result!=null){
          cbResult({
            valid: true,
            nombre: result.nombre,
            montopagado: result.montopagado,
            cantpersonas: result.cantpersonas,
            hora:result.hora
          
          });
        } else{
          cbResult({
            valid: false
          })
        }
        }

        client.close();

      });

    }

  });

}

const dameLocales = (nombre, cbResult) => {
  mongodb.MongoClient.connect(mongoURL, (err, client) => {
    if (err) {
      
      cbResult({
        
        valid: false
      });
      
    } else {
      const proyectoDB = client.db("proyecto");
      const localCol = proyectoDB.collection("locales");
      localCol.findOne({ nombre: nombre }, (err, result) => {
        if (err) {
         
          cbResult({
            valid: false
          });
        } else {
          if(result!=null){
          cbResult({
            valid: true,
            nombre: result.nombre,
            direccion: result.direccion,
            precioreserva: result.precioreserva,
            dispDias:result.dispDias,
            dispHoras:result.dispHoras
          });
        } else{
          cbResult({
            valid: false
          })
        }
        }

        client.close();

      });

    }

  });

}



module.exports = {
  login,
  getUser,
  registerUser,
  postLocal,
  newReserva,
  dameReservas,
  dameLocales
}