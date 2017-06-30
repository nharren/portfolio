'use strict';

const pg = require('pg');
const fs = require('fs');
const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
const requestProxy = require('express-request-proxy');
const PORT = process.env.PORT || 3000;
const app = express();

const connectionString = process.env.DATABASE_URL;
const client = new pg.Client(connectionString);
client.connect();
client.on('error', err => console.error(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./public'));

app.get('/', function(request, response) {
  response.sendFile('./public/index.html', {root: './public'});
})

app.get('/snake', function(request, response) {
  response.sendFile('./public/index.html', {root: './public'});
})

app.get('/about', function(request, response) {
  response.sendFile('./public/index.html', {root: './public'});
})

app.get('/project', function(request, response) {
  client.query(`
    SELECT * FROM project p
    INNER JOIN project_technology pt
      ON p.project_id = pt.project_id;`
  )
  .then(function(result) {
    var groupBy = result.rows.reduce(function(acc,cur) {
      let project = acc.find(v => v.project_id === cur.project_id);

      if (project === undefined) {
        project = cur;
        project.technologies = [];
        acc.push(project);
      }

      project.technologies.push(cur.technology_id);

      delete cur.technology_id;

      return acc;
    }, []);

    response.send(groupBy);
  })
  .catch(console.error);
})

app.get('/technology', function(request, response) {
  client.query(`
    SELECT * FROM technology;`
  )
  .then(function(result) {
    response.send(result);
  })
  .catch(console.error);
})

app.get('/technology/:id', (request, response) => {
  client.query(`
    SELECT * FROM technology
    WHERE technology_id = ${request.params.id};`
  )
  .then(result => response.send(result.rows))
  .catch(console.error);
});

app.get('/github/*', proxyGitHub);

app.get('*', function(request,response) {
  response.status(404).send('That page does not exist.');
});

function proxyGitHub(request, response) {
  console.log('Routing GitHub request for', request.params[0]);
  (requestProxy({
    url: `https://api.github.com/${request.params[0]}`,
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`
    }
  }))(request, response);
}

app.listen(PORT, function() {
  console.log('Listening on port: ', PORT);
});

let projectsData;

getLocalData();

function getLocalData() {
  fs.readFile('./public/data/projects.json', function (err, localProjectsData) {
    if (err) processError(err);
    processLocalData(JSON.parse(localProjectsData));
    getRemoteData();
  });
}

function processError(err) {
  console.error(err);
}

function processLocalData(localProjectsData) {
  projectsData = localProjectsData;
}

function getRemoteData() {
  request('/github/users/nharren/repos', function (error, response, body) {
    if (error) processError(error);

    let remoteData = JSON.parse(body);
    processRemoteData(remoteData);
  });
}

function processRemoteData(remoteProjectsData) {
  remoteProjectsData.forEach(function(remoteProjectData) {
    var projectData = projectsData.find(p => p.github_name === remoteProjectData.name);

    if (projectData !== undefined) {
      projectData.description = remoteProjectData.description;
      projectData.url = remoteProjectData.html_url;
    }
  })

  createTables();
}

function createTables() {
  client.query(createTablesQuery)
        .then(insertProjects, processError);
}

let createTablesQuery =
 `CREATE TABLE IF NOT EXISTS
  project (
    project_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    github_name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    url VARCHAR(255) UNIQUE NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS
  technology (
    technology_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS
  project_technology (
    technology_id INTEGER REFERENCES technology (technology_id) ON UPDATE CASCADE,
    project_id INTEGER REFERENCES project (project_id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT project_technology_pk PRIMARY KEY (technology_id, project_id)
  );`;

function insertProjects() {
  client.query(buildInsertProjectsQuery())
        .then(insertTechnologies, processError);
}

function buildInsertProjectsQuery() {
  return projectsData.map(buildInsertProjectQuery)
                     .reduce((acc, cur) => acc + cur);
}

function buildInsertProjectQuery(projectData) {
  return `INSERT INTO project(title, image, github_name, description, url) 
          VALUES('${projectData.title}', '${projectData.image}', '${projectData.github_name}', '${projectData.description}', '${projectData.url}') ON CONFLICT DO NOTHING;`;
}

function insertTechnologies() {
  client.query(buildInsertTechnologiesQuery())
        .then(queryProjects, processError);
}

function buildInsertTechnologiesQuery() {
  return projectsData.map(projectData => projectData.technologies)
                     .reduce((acc, cur) => acc.concat(cur), [])
                     .filter((v, i, a) => a.indexOf(v) === i)
                     .map(buildInsertTechnologyQuery)
                     .reduce((acc, cur) => acc + cur);
}

function buildInsertTechnologyQuery(technology) {
  return `INSERT INTO technology(name) 
          VALUES('${technology}') ON CONFLICT DO NOTHING;`
}

function queryProjects() {
  client.query(`SELECT project_id, github_name FROM project;`)
        .then(createProjectLookup);
}

let projectLookup;

function createProjectLookup(result) {
  projectLookup = result.rows;
  queryTechnologies();
}

function queryTechnologies() {
  client.query(`SELECT technology_id, name FROM technology;`)
        .then(createTechnologyLookup);
}

let technologyLookup;

function createTechnologyLookup(result) {
  technologyLookup = result.rows;
  insertAssociations();
}

function insertAssociations() {
  client.query(buildAssociationQueries())
        .then(() => {}, processError);
}

function buildAssociationQueries() {
  return projectsData.map(buildProjectAssociationQueries)
                     .reduce((acc, cur) => acc.concat(cur), [])
                     .reduce((acc, cur) => acc + cur, '');
}

function buildProjectAssociationQueries(projectData) {
  let projectId = projectLookup.find(record => record.github_name === projectData.github_name).project_id;

  return projectData.technologies.map(function(technology) {
    let technologyId = technologyLookup.find(record => record.name === technology).technology_id;

    return `INSERT INTO project_technology(technology_id, project_id) 
            VALUES(${technologyId}, ${projectId}) ON CONFLICT DO NOTHING;`
  });
}
