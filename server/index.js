//Initialzie Express
const express = require("express"),
      cors = require("cors"),
      pool = require("./database");

const app = express();

//middleware
app.use(cors());
app.use(express.json()); // gives access to req.body

//ROUTES
//create a todo item
app.post("/todos", async (req, res) => {
    try {
        const {description} = req.body;
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *", [description]);

        res.json(newTodo.rows[0]);
    } catch (err) {
        console.log(err.message)
    }
})

//get all items
app.get("/todos", async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo");
        res.json(allTodos.rows);
    } catch (err) {
        console.log(err.message);
    }
})

//get one item
app.get("/todos/:id", async (req, res) => {
    try {
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id =$1",[req.params.id])
        res.json(todo.rows[0]);
    } catch (err) {
        console.log(err.message)
    }
})

//update an item
app.put("/todos/:id", async (req, res) => {
    try {
        const {description} = req.body;
        const {id} = req.params

        const updateTodo= await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [description, id]);
        res.json("Todo was updated");
    } catch (err) {
        console.log(err.message)
    }
})

//delete a todo

app.delete("/todos/:id", async (req, res) =>{
    try {
        const {id} = req.params;
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);
        res.json("Todo was deleted")
    } catch (err) {
        console.log(err.message)
    }
})


//Listen on Port
app.listen(5000, ()=> {
    console.log("Server has started on Port 5000")
})