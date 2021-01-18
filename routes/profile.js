const express = require("express");
const router = express.Router();
const User = require("../models/user");
const mongoose = require("mongoose");
const multer = require('multer');

// RUTA PARA OBTENER EL USUARIO

router.get("/:id", async (req, res, next) => {
 
  let myUserFounded = await User.findById(req.params.id);
  try {
    res.json(myUserFounded);
  } catch (error) {
    console.log(error);
  }
});



// RUTA PARA PODER EDITAR LA INFORMACION DEL USUARIO

router.put("/:id/editUser", (req, res, next) => {
  console.log(req.body, "console log de reqbody")
  User.findByIdAndUpdate(
     req.params.id ,
    {
        name: req.params.name,
        firstSurname: req.params.firstSurname,
        secondSurname: req.params.secondSurname,
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

// RUTA PARA PODER ELIMINAR EL USUARIO



module.exports = router;