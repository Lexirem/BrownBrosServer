const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    surname: String,
    password: String,
    email: String,
    direction: String,
    postalCode: String,
    card: Number,
    carrito: { type: Schema.Types.ObjectId, ref: "Carrito" }
}, 
{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;