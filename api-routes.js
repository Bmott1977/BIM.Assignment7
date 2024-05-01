
const router = require('express').Router()
const { response, request} = require('express')
const { MongoClient, ObjectId } = require('mongodb')

const url = process.env.MONGODB_URI || require('./secrets/mongodb.json').url
const client = new MongoClient(url)

const getCollection = async (dbName, collectionName) => {
    await client.connect()
    return client.db(dbName).collection(collectionName)
}

// GET /api/todos

router.get('/todos', async (request, response) => {
    const collection = await getCollection('todo-api', 'todo')
    const todos = await (await collection.find().toArray()).map(todo => {
        const { item, complete } = todo
        return {id: todo._id, item, complete }
    })
	response.json(todos)
})

// POST /api/todos

router.post('/todos', async (request, response) => {
	const {item} = request.body
	const complete = false 

    const collection = await getCollection('todo-api', 'todo')
    const result = await collection.insertOne({ item, complete})
	response.json(result)
})

// PUT /api/todos/:id

router.put('/todos/:id', async (request, response) => {
    const collection = await getCollection('todo-api', 'todo')
    const {id} = request.params
    const todo = await collection.findOne({ _id: new ObjectId(id) })
    const complete = !todo.complete
    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { complete } })

	// const {id} = request.params
	// const task = todos.find(todo => todo.id.toString() === id)
	// task.complete = !task.complete

    response.json(result)
})

module.exports = router
