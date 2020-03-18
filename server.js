var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var Promise = require('bluebird');
require("date-format-lite");

var port = 1337;
var app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

let simulationData = [{
        id: 1,
        text: "Project #1",
        start_date: "01-04-2018",
        duration: 18,
        progress: 0.4,
        open: true
    },
    {
        id: 2,
        text: "Task #1",
        start_date: "06-04-2018",
        duration: 4,
        progress: 0.5,
        parent: 1
    },
    {
        id: 3,
        text: "Task #2",
        start_date: "05-04-2018",
        duration: 6,
        progress: 0.7,
        parent: 1
    },
    {
        id: 4,
        text: "Task #3",
        start_date: "07-04-2018",
        duration: 2,
        progress: 0,
        parent: 1
    },
    {
        id: 5,
        text: "Task #1.1",
        start_date: "05-04-2018",
        duration: 5,
        progress: 0.34,
        parent: 2
    },
    {
        id: 6,
        text: "Task #1.2",
        start_date: "11-04-2018",
        duration: 4,
        progress: 0.5,
        parent: 2
    },
    {
        id: 7,
        text: "Task #2.1",
        start_date: "07-04-2018",
        duration: 5,
        progress: 0.2,
        parent: 3
    },
    {
        id: 8,
        text: "Task #2.2",
        start_date: "06-04-2018",
        duration: 4,
        progress: 0.9,
        parent: 3
    },
];

let simulationLink = [
    { id: 1, source: 1, target: 2, type: "1" },
    { id: 2, source: 2, target: 3, type: "0" }
];

app.get("/data", function(req, res) {
    return res.send({
        data: simulationData,
        collections: { links: simulationLink }
    });
});

// add a new task
app.post("/data/task", function(req, res) {
    var task = getTask(req.body);
    console.log('====================================');
    console.log('Tarea recibida', task);
    console.log('====================================');
    let id = simulationData.length;
    console.log('EL LEN DEL ARRYA', id);
    const i = id + 1;
    task = { id: i, ...task };
    simulationData.push(task);
    console.log('Tareas: ', simulationData);
    sendResponse(res, "inserted", id++);
});

// update a task
app.put("/data/task/:id", function(req, res) {
    var sid = req.params.id,
        task = getTask(req.body);

    console.log('====================================');
    console.log('Tarea recibida', task);
    console.log('====================================');
    const indexTask = simulationData.findIndex(x => x.id === Number(sid));
    simulationData.splice(indexTask, 1);
    simulationData.push({ id: sid, ...task });
    console.log('Tareas: ', simulationData);
    sendResponse(res, "updated");
});

// delete a task
app.delete("/data/task/:id", function(req, res) {
    var sid = req.params.id;
    const indexTask = simulationData.findIndex(x => x.id === Number(sid));
    simulationData.splice(indexTask, 1);
    console.log('Tareas: ', simulationData);
    sendResponse(res, "deleted");
});

// add a link
app.post("/data/link", function(req, res) {
    var link = getLink(req.body);
    console.log('====================================');
    console.log('Link recibido', link);
    console.log('====================================');
    let id = simulationLink.length;
    const i = id + 1;
    link = { id: i, ...link };
    simulationLink.push(link);
    console.log('Links: ', simulationLink);
    sendResponse(res, "inserted", id++);
});

// update a link
app.put("/data/link/:id", function(req, res) {
    var sid = req.params.id,
        link = getLink(req.body);

    console.log('====================================');
    console.log('Link recibido', link);
    console.log('====================================');
    const indexLink = simulationLink.findIndex(x => x.id === Number(sid));
    simulationLink.splice(indexLink, 1);
    simulationLink.push({ id: sid, ...task });
    console.log('Links: ', simulationLink);

    sendResponse(res, "updated");
});

// delete a link
app.delete("/data/link/:id", function(req, res) {
    var sid = req.params.id;
    const indexLink = simulationLink.findIndex(x => x.id === Number(sid));
    simulationLink.splice(indexLink, 1);
    console.log('Links: ', simulationLink);
    sendResponse(res, "deleted");
});


function getTask(data) {
    return {
        text: data.text,
        start_date: data.start_date.date("YYYY-MM-DD"),
        duration: data.duration,
        progress: data.progress || 0,
        parent: data.parent
    };
}

function getLink(data) {
    return {
        source: data.source,
        target: data.target,
        type: data.type
    };
}

function sendResponse(res, action, tid, error) {
    if (action == "error")
        console.log(error);

    var result = {
        action: action
    };
    if (tid !== undefined && tid !== null)
        result.tid = tid;

    console.log('RESULT', result);

    res.send(result);
}

app.listen(port, function() {
    console.log("Server is running on port " + port + "...");
});