const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Carta = require("../models/carta");
const Carrito = require("../models/carrito");

const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require("../helpers/middlewares");

router.get("/carrito", isLoggedIn(), async (req, res, next) => {
    try {
      const userId = req.session.currentUser._id;
      const cart = await Carrito.findOne({ user: userId }).populate(
        "products.product"
      );
      res.status(200).json(cart);
    } catch (error) {
      console.log(error);
    }
  });
  
  
  router.post("/addproduct/:id", isLoggedIn(), async (req, res, next) => {
    try {
      const productId = req.params.id;
      const userId = req.session.currentUser._id;
  
      const userShoppingCart = await Carrito.findOneAndUpdate(
        {
          user: userId,
        },
        { $addToSet: { products: { product: productId, quantity: 1 } } },
        { new: true }
      ).populate("products.product");
      res.status(200).json(userShoppingCart);
    } catch (error) {
      console.log("Error al añadir el producto");
    }
  });
  
  router.post("/deleteproduct", isLoggedIn(), async (req, res, next) => {
    try {
      const { _id } = req.body;
      const userId = req.session.currentUser._id;
      const carrito = await Carrito.findOneAndUpdate(
        { user: userId },
        { $pull: { products: { _id: _id } } },
        (err, cart) => {
          if (err) {
            console.log(err);
            return res.send(err);
          }
          res.status(200).json(cart);
        }
      ).populate("products.product");
    } catch (error) {
      console.log("Error al eliminar el producto");
    }
  });
  
  router.post("/addquantity", isLoggedIn(), async (req, res, next) => {
    try {
      const _id = req.body._id;
      const quantity = req.body.quantity;
      const userId = req.session.currentUser._id;
  
      const carrito = await ShoppingCart.findOneAndUpdate(
        {
          user: userId,
          "products._id": _id,
        },
  
        { $set: { "products.$.quantity": quantity } }
      );
      res.status(200).json(carrito);
    } catch (error) {
      console.log("Error to set the product");
    }
  });

  module.exports = router;