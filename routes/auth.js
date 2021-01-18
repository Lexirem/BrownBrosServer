const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../models/user");

// HELPER FUNCTIONS
const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require("../helpers/middlewares");

//  POST '/signup'

router.post("/signup",
 
  isNotLoggedIn(),
    
  validationLoggin(),
  async (req, res, next) => {
   
    const { email, password } = req.body;

    try {
      // chequea si el email ya existe en la BD
      const emailExists = await User.findOne({email}, "email");
	
      // si el usuario ya existe, pasa el error a middleware error usando next()
      if (emailExists) return next(createError(400));
    
      else {
        // en caso contrario, si el usuario no existe, hace hash del password y crea un nuevo usuario en la BD
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPass = bcrypt.hashSync(password, salt);
        
		const newUser = await User.create({ email, password: hashPass})
        
        // luego asignamos el nuevo documento user a req.session.currentUser y luego enviamos la respuesta en json
        req.session.currentUser = newUser;
        res
            .status(200)
            .json(newUser)
      } 
    } catch (error) {
      next(error);
    }
  }
);


//  POST '/login'

router.post("/login",
  // chequea que el usuario no esta logueado usando la funcion helper (chequea si existe req.session.currentUser)
  // revisa que el email y el password se estan enviando usando la funcion helper
  isNotLoggedIn(),
    
  validationLoggin(),
    async (req, res, next) => {
      const { email, password } = req.body;
      try {
        // revisa si el usuario existe en la BD
        const user = await User.findOne({ email });
        
        // si el usuario no existe, pasa el error al middleware error usando next()
        if (!user) {
          next(createError(404));
        }
        // si el usuario existe, hace hash del password y lo compara con el de la BD
        // loguea al usuario asignando el document a req.session.currentUser, y devuelve un json con el user
        else if (bcrypt.compareSync(password, user.password)) {
          req.session.currentUser = user;
          res.status(200).json(user);
          res.redirect('/');
          return;
        } else {
          next(createError(401));
        }
      } catch (error) {
        next(error);
      }
    }
);

// POST '/logout'

// revisa si el usuario esta logueado usando la funcion helper (chequea si la sesion existe), y luego destruimos la sesion
router.post("/logout", isLoggedIn(), (req, res, next) => {          
  req.session.destroy();
  res
    .status(204) //  No Content
    .send();
  return;
});


// GET '/private'   --> Only for testing

// revisa si el usuario esta logueado usando la funcion helper (chequea si existe la sesion), y devuelve un mensaje
router.get("/private", isLoggedIn(), (req, res, next) => {
  res
    .status(200) // OK
    .json({ message: "Test - User is logged in" });
});


// GET '/me'

// chequea si el usuario esta logueado usando la funcion helper (chequea si existe la sesion)
router.get("/me", isLoggedIn(), (req, res, next) => {
  console.log(req.body, 'body')
  req.session.currentUser.password = "*";
  res.json(req.session.currentUser);
});

module.exports = router;