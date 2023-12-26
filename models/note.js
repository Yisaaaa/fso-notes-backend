const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

console.log("Connecting to ", url);

mongoose
    .connect(url)
    .then((result) => console.log("Successfully connected to MongoDB"))
    .catch((error) => console.log("Can't connect to MongoDB: ", error.message));

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
});

noteSchema.set("toJSON", {
    transform: (doc, returnedObj) => {
        returnedObj.id = returnedObj._id.toString();
        delete returnedObj._id;
        delete returnedObj.__v;
    },
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
