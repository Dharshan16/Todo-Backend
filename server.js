// Using Express
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

//creating an instance of express 
const app = express();
app.use(express.json());
app.use(cors());


// sample in- memory storage for todo items
//let todos = [];

// connecting mongoDB
mongoose.connect('mongodb://0.0.0.0:27017/todolist')
.then(() => {
    console.log('DB Connected')
})
.catch((err) =>{
    console.log(err)
})

//Creating Schema
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String

})

//creating model
const todoModel = mongoose.model('Todo', todoSchema);

//create a new ToDo item 
app.post('/todos', async (req, res) => {
    const {title, description} = req.body;
    // const newTodo = {
    //     id : todos.length +1,
    //     title,
    //     description
    // };
    // todos.push(newTodo);
    // console.log(todos)
try {   
     const newTodo = new todoModel({title, description});
    await newTodo.save();
    res.status(201).json(newTodo)
} catch (error) {
    console.log (error);
    res.status(500).json({message: error.message})
}

})

//Get all the items
app.get('/todos', async (req, res) => {
    try {
        const todos = await todoModel.find();
        res.json(todos);
    }catch(error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
})

//Update a todo item
app.put('/todos/:id', async (req, res) => {
    try{
        const {title, description} = req.body;
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id, 
            {title, description},
            {new : true}
        )    
        if (!updatedTodo) {
            return res.status(404).json({message: "Todo not Found"})
        }
    } catch(error){
        console.log(error)
        res.status(500).json({message: error.message});
    }
})

// Deleting a todo Item

app.delete('/todos/:id', async (req, res) =>{
    try{
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id)
        res.status(204).end();

    }catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
    const id = req.params.id;
    await todoModel.findByIdAndDelete(id)
    res.status(204).end(); 
})

//Starting the server

const port = 8000;
app.listen(port, () => {
    console.log("Server is listening to port " +port);
})