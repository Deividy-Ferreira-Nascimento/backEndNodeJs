const { query, response } = require('express');
const express = require('express')
const cors = require('cors')
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(cors())
app.use(express.json());

const projects = [];

function logRequest(req, res, next) {
    const { method, url } = req;

    const logLabel = `[${method.toUpperCase()}] ${ url } `
    console.time(logLabel)

     
    console.timeEnd(logLabel)
    
    return next(); //proximo middleware

};

function validateUpdate (req, res, next) {
    const { id } = req.params;

    if(!isUuid(id)) {
        return res.status(400).json({error: "Invalidade project id"})
    }
    return next()
};

app.use(logRequest)

app.get('/project',(req, res) => {
    //query.params
    const {title} = req.query

    const results = title ? projects.filter(project => project.title.includes(title)): projects
    
    
    return res.json(results)
});


app.post('/project', (req,res) => {
   const {title, owner} = req.body
    
   const project = {id:uuid(),title, owner };
   

   projects.push(project)

    return res.json(project)


});

app.put('/project/:id', validateUpdate, (req,res) => {
   //routes.params
   const {id} = req.params;
   const {title, owner} = req.body

    const projectIndex = projects.findIndex(project => project.id == id)

    if(projectIndex < 0) {
        return res.status(404).json({erro: "Project not found"})
    }

    const project = {
        id,
        title,
        owner,
    };

    projects[projectIndex] = project

    return res.json(project) 
});

app.delete('/project/:id', validateUpdate, (req,res) => {
    const { id } = req.params;
    const projectIndex = projects.findIndex(project => project.id == id)

    if(projectIndex < 0) {
        return res.status(404).json({erro: "Project not found"})
    }

    projects.splice(projectIndex, 1);
    
   
    return res.status(204).send() 
    
});

app.listen(3333, () => {
    console.log("🚀 Back-end started 🚀")
})
