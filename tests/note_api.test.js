const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const Note = require("../models/note");

const api = supertest(app);

beforeEach(async () => {
	await Note.deleteMany();

	await Promise.all(
		helper.initialNotes.map(async (note) => {
			const noteObj = new Note(note);

			await noteObj.save();
		})
	);
});

test("notes are returned as json", async () => {
	await api
		.get("/api/notes")
		.expect(200)
		.expect("Content-Type", /application\/json/);
}, 10000);

test("all notes are returned", async () => {
	const response = await api.get("/api/notes");

	expect(response.body).toHaveLength(helper.initialNotes.length);
});

test("a specific note is within the returned notes", async () => {
	const response = await api.get("/api/notes");
	const contents = response.body.map((note) => note.content);

	expect(contents).toContain("Browser can execute only JavaScript");
});

test("a valid note can be added", async () => {
	const newNote = {
		content: "async/await simplifies making async calls",
		important: true,
	};

	await api
		.post("/api/notes")
		.send(newNote)
		.expect(201)
		.expect("Content-Type", /application\/json/);

	const notesAtEnd = await helper.notesInDb();
	expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1);

	const contents = notesAtEnd.map((note) => note.content);
	expect(contents).toContain("async/await simplifies making async calls");
});

test("note without content is not added", async () => {
	const newNote = {
		important: false,
	};

	await api.post("/api/notes").send(newNote).expect(400);

	const notesAtEnd = await helper.notesInDb();

	expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
});

test("a specific note can be viewed", async () => {
	const noteAtStart = await helper.notesInDb();
	const noteToView = noteAtStart[0];

	const response = await api
		.get(`/api/notes/${noteToView.id}`)
		.expect(200)
		.expect("Content-Type", /application\/json/);

	expect(response.body).toEqual(noteToView);
});

test("a note can be deleted", async () => {
	const notesAtStart = await helper.notesInDb();
	const noteToDelete = notesAtStart[0];

	await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

	const notesAtEnd = await helper.notesInDb();
	expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1);

	const contents = notesAtEnd.map((n) => n.content);
	expect(contents).not.toContain(noteToDelete.content);
});

afterAll(async () => {
	await mongoose.connection.close();
});
