const express = require('express');
const server = express();
server.use(express.json());

const projects = [];
let count = 0;
//middleware local
function checkProjectExist(req, res, next) {
  const { id } = req.params;
  const project = projects.find( p=>p.id === id);

  if(!project) {
    return res.status(400).json({erro: 'project not found!'})
  }

  next();
}

//function counterRequest(req, res , next){
  //numberOfRequests++;
  //console.log(`Número de requisições: ${numberOfRequests}`);
  //return next();
//}

server.use((req, res, next) =>{
  count++;
  console.log(`Número de requisições: ${count}`);

  return next();
});

/* metodo post
*  rota que recebe um id e um title no req body
*  para cadastrar no array 
*/
server.post('/projects', (req, res) => {
  const {id, title } = req.body;

  const project = {
    id, 
    title,
    tasks:[]
  };

  projects.push(project);

  return res.json(project);

});
/** metodo get
 * rota q lista todos os projetos e suas tarefas
 */
server.get('/projects', (req, res) => {
  return res.json(projects);
});
/**
 * metodo put recebe um id e altera o titulo do projeto
 * rota recebe o id da query params e o title do corpo da requisição
 */
server.put('/projects/:id',checkProjectExist,(req, res) =>{
  const { id } = req.params;
  const { title } = req.body;
  //primeiro voce encontra o id e faça recebe esse parametro(objeto) no project
  const project = projects.find(p => p.id === id);

  project.title = title;

  return res.json(project);

});
/**
 * rota deleta um id presente nos parametros da rota
 */
server.delete('/projects/:id',checkProjectExist, (req, res) =>{
  const { id } = req.params;

  const index = projects.find(p => p.id === id);

  projects.splice(index, 1);

  return res.send();
});
/**
 * a rota recebe um title e armazena esse title no array de tasks []
 */
server.post('/projects/:id/tasks',checkProjectExist,(req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const index = projects.find(p=>p.id === id);
  index.tasks.push(title);

  return res.json(index);
});


server.listen(3000);
