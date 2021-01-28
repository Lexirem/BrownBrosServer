const mongoose = require ("mongoose");
const Schema = mongoose.Schema;

const cartaSchema = new Schema({
    title: String,
    description: String,
    typefood: String,
    price: String,
    extras: [String]
},
{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
});

const Carta = mongoose.model("Carta", cartaSchema);

module.exports = Carta; 