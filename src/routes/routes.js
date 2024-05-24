import { randomUUID } from "node:crypto";
import { Database } from "../database/database.js"
import { buildRoutePath } from "../utils/build-route-path.js";

const database = new Database();

export const Routes = [
    {
        method: "GET",
        path: buildRoutePath("/task"),
        handler: (req, res) => {
            // console.log(req.query);
            const { search } = req.query;
            const tasks = database.select("tasks", search ? { title: search, description: search } : null);
            return res.writeHead(200).end(JSON.stringify({ Tasks: tasks }));
        }
    },

    {
        method: "POST",
        path:buildRoutePath("/task"),
        handler: (req, res) => {
            const { title, description } = req.body;
            if(title && description) {
                const task = { 
                    id: randomUUID(),
                    title, 
                    description,
                    completed_at: null,
                    created_at: new Date(),
                    updated_at: new Date()
                };

                database.insert("tasks", task);
                return res.writeHead(201).end(JSON.stringify({ message: "Task Created Successfully" }));
            }
            return res.writeHead(400).end(JSON.stringify({ message: "Please, fill in all fields (title and description)." }));         
        }
    },

    {
        method: "PUT",
        path:buildRoutePath("/task/:id"),
        handler: (req, res) => {
            const { id } = req.params;
            const { title, description } = req.body; 
            const [task] = database.select("tasks", { id });
            if(!task) {
                return res.writeHead(404).end(JSON.stringify({ message: "Task not found." }));
            }           
            if(title && !description) {
                database.update("tasks", id, { title, updated_at: new Date() }) 
                return res.writeHead(204).end();
            } else if(description && !title) {
                database.update("tasks", id, { description, updated_at: new Date() })  
                return res.writeHead(204).end(); 
            } else{ 
                return res.writeHead(400).end(JSON.stringify({ message: "You can only change one data at a time." })); 
            }
        }
    },

    {
        method: "PATCH",
        path:buildRoutePath("/task/:id/complete"),
        handler: (req, res) => {
            const { id } = req.params;
            const [task] = database.select("tasks", { id });
            if(!task) {
                return res.writeHead(404).end(JSON.stringify({ message: "Task not found." }));
            }
            const isTaskCompleted = !!task.completed_at
            const completed_at = isTaskCompleted ? null : new Date();
            database.update("tasks", id, { completed_at });
            res.writeHead(204).end();
        }
    },

    {
        method: "DELETE",
        path:buildRoutePath("/task/:id"),
        handler: (req, res) => {
            const { id } = req.params;
            const [task] = database.select("tasks", { id });
            if(!task) {
               return res.writeHead(404).end(JSON.stringify({ message: "Task not found." }));
            }
            database.delete("tasks", id)
            return res.writeHead(204).end(); 
        }
    },
]