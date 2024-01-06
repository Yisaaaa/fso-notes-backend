const Note = require("../models/note");

const initialNotes = [
	{ content: "HTML is easy", important: false },
	{ content: "Browser can execute only JavaScript", important: true },
];

const nonExistingId = async () => {
	const note = new Note({ content: "will remove this soon" });

	await note.save();
	await note.deleteOne();

	console.log(note._id);

	return note._id.toString();
};

const notesInDb = async () => {
	const notes = await Note.find({});

	return notes.map((note) => note.toJSON());
};

module.exports = {
	initialNotes,
	notesInDb,
	nonExistingId,
};
