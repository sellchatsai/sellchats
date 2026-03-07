import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({

    label: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    author: {
        type: String,
        required: true
    },

    date: {
        type: String,
        required: true
    },

    link: {
        type: String
    }

});

export default mongoose.model("Blog", BlogSchema);