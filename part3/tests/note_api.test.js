const { test, after, beforeEach } = require('node:test')
const Note = require('../models/note')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')  //The test imports the Express application from the app.js module
const assert = require('assert');
const api = supertest(app)


beforeEach(async () => {
  await Note.deleteMany({})
  const noteObjects = helper.initialNotes
    .map(note => new Note(note))
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray) //wait for all of the asynchronous operations to finish executing with the Promise.all method
})

// notes show
test('notes are returned as json', async () => {
    console.log('entered test')
    await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/) //regex
})

test('all notes are returned', async () => {
    const response = await api.get('/api/notes')
    // execution gets here only after the HTTP request is complete
// the result of HTTP request is saved in variable response
    assert.strictEqual(response.body.length, helper.initialNotes.length)
  })
  
test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')
  const contents = response.body.map(r => r.content)

  assert(contents.includes('Browser can execute only JavaScript'))
})
// notes add
test('a valid note can be added ', async () => {
    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true,
    }
  
    await api
      .post('/api/notes')
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const notesAtEnd = await helper.notesInDb()
    assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)
  
    const contents = notesAtEnd.map(r => r.content)
    assert(contents.includes('async/await simplifies making async calls'))
  })

test('note without content is not added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const notesAtEnd = await helper.notesInDb()

  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
})

// notes show and delete
test('a specific note can be viewed', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToView = notesAtStart[0]

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(resultNote.body, noteToView)
})

test('a note can be deleted', async () => {
    const notesAtStart = await helper.notesInDb()
    const notesToDelete = notesAtStart[0]
    
    await api
      .delete(`/api/notes/${notesToDelete.id}`)
      .expect(204)
    
    const notesAtEnd = await helper.notesInDb()
    const contents = notesAtEnd.map(r => r.content)
    assert(!contents.includes(notesToDelete.content))
    assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
})

after(async () => {
  await mongoose.connection.close()
})