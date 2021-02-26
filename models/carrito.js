const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carritoSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Carta" },
      quantity: { type: Number },
    },
  ],
});

const Carrito = mongoose.model("Carrito", carritoSchema);

module.exports = Carrito;