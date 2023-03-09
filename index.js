const express = require('express');
const app = express();
const config = require('./config');
const Task = require('./models/task');

app.use(express.urlencoded({extended: false}));
app.use(express.json());

//TEST DB Connection
config.authenticate()
.then(function(){
    console.log('Database is connected.')
})
.catch(function(err) {
    console.log(err);
});

//Retreive all tasks
app.get('/tasks', function(req, res) {
    Task.findAll().then(function(results){
        res.status(200).send(results)
    }).catch(function(err){
        res.status(500).send(err);
    });

})

//Create New Task
app.post('/tasks', function (req, res) {
    let task_data = req.body;  

    Task.create(task_data).then(function(result) {
        res.status(200).send(result);  //result is the item that was created        
    })
    .catch(function(err){
        res.status(500).send(err);
    });

})

//Update task progress level
app.patch('/tasks/update-progress-level/:task_id', function(req, res){
    const task_id = parseInt(req.params.task_id);

    //Find the task
    Task.findByPk(task_id)
    .then(function(result) {
        //Check if task exists in database table
        if(!result) {
            res.status(404).send('Task was not found');
            return;
        }
        result.progress_level = req.body.progress_level;

        //Save the Update into database
        result.save()
        .then(function() {
            res.status(200).send(result);
        });
    })
    .catch(function(err) {
        res.status(500).send(err);
    })
});

//Delete task
app.delete('/tasks/:task_id', function(req, res){
    const task_id = parseInt(req.params.task_id);

    //Find the task
    Task.findByPk(task_id)
    .then(function(result) {
        //Check if task exists in database table
        if(!result) {
            res.status(404).send('Task was not found');
            return;
        }
        //result.progress_level = req.body.progress_level;

        //delete task into database
        result.destroy()
        .then(function() {
            res.status(200).send(result);
        });
    })
    .catch(function(err) {
        res.status(500).send(err);
    })
});

app.listen(3000, function() {
    console.log("Server is running on Port 3000...")
});