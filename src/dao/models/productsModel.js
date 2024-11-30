import mongoose from "mongoose";
import mongosePaginate from "mongoose-paginate-v2";


const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    thumbnails: {
        type: Array
    }
},

{
    timestamps: true,
    strict: false
}) 


productSchema.plugin(mongosePaginate)

export const  productosModel = mongoose.model('products', productSchema)