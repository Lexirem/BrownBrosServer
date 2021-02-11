const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');

const User = require("../models/user");


// RUTA PARA OBTENER EL USUARIO

router.get("/:id", async (req, res, next) => {
 
  let myUserFounded = await User.findById(req.params.id);
  try {
    res.json(myUserFounded);
  } catch (error) {
    console.log(error);
  }
});

router.post("/:id", async (req, res, next) => {
  let myUser = await User.findById(req.params.id);
  try{
    res.json(myUser)

  }catch (error){
    console.log(error)
  }
});



// RUTA PARA PODER EDITAR LA INFORMACION DEL USUARIO

router.put("/:id/edit", (req, res, next) => {
  User.findByIdAndUpdate(
     req.params.id ,
    {
        name: req.params.name,
        surname: req.params.surname,
        password: req.params.password,
        email: req.params.email,
        direction: req.params.direction,
        postalCode: req.params.postalCode,
        card: req.params.card,
    },
    { new: true }
  )
    .then((updateUser) => {
      res.locals.currentUserInfo = updateUser;
      res.status(200).json(updateUser);
    })
    .catch((error) => {
      console.log(error);
    });
});


module.exports = router;