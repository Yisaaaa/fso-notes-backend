const mongoose = require("mongoose");

if (process.argv.process < 3) {
	console.log("give password as an argument");
	process.exit(1);
}

const passwd = process.argv[2];

const url = `mongodb+srv://ryansanisit19:${passwd}@fso-notes.s097f27.mongodb.net/noteApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
	content: String,
	important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

const note = new Note({
	content: "The queen",
	important: false,
});

// note.save().then((result) => {
// 	console.log(result);
// 	console.log("note was saved");
// 	mongoose.connection.close();
// });

Note.find({}).then((result) => {
	result.forEach((note) => console.log(note));
	mongoose.connection.close();
});
