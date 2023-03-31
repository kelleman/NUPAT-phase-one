const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const axios = require("axios").default

app.use(cors())

const PORT = 4000

const API_KEY = '09d60864bfmshe1f3fee77e038f4p1e1fc6jsndb03426ada54'
const API_HOST = 'yummly2.p.rapidapi.com'

// Endpoint to get auto-complete suggestions
app.get('/auto-complete', (req, res) => {
  const options = {
    method: 'GET',
    url: 'https://yummly2.p.rapidapi.com/feeds/auto-complete',
    params: {q: 'chicken soup'},
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': API_HOST,
    },
  };

  axios
    .request(options)
    .then(function (response) {
      res.set('Content-Type', 'application/vnd.yummly.v1+json');
      res.send(response.data);
    })
    .catch(function (error) {
      console.error(error);
      if (error.response) {
        res.status(error.response.status).send(error.response.statusText);
      } else if (error.request) {
        res.status(500).send('Internal Server Error');
      } else {
        res.status(500).send('Unknown Error');
      }
    });
});


// endpoint to get recipe list
app.get('/recipes-list', (req, res) => {
  const options = {
    method: 'GET',
    url: 'https://yummly2.p.rapidapi.com/feeds/list',
    params: { limit: '24', start: '0' },
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': API_HOST,
    },
  };

  axios
    .request(options)
    .then(function (response) {
      res.set('Content-Type', 'application/vnd.yummly.v1+json');
      res.send(response.data);
    })
    .catch(function (error) {
      console.error(error);
      if (error.response) {
        res.status(error.response.status).send(error.response.statusText);
      } else if (error.request) {
        res.status(500).send('Internal Server Error');
      } else {
        res.status(500).send('Unknown Error');
      }
    });
});


// Endpoint to search recipes
app.get('/recipes/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const options = {
      method: 'GET',
      url: 'https://yummly2.p.rapidapi.com/feeds/search',
      params: {
        start: '0',
        maxResult: '18',
        q: query,
      },
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST
      }
    };
    const response = await axios.request(options);
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Endpoint for retrieving similar recipes
app.get('/similar-recipes/:recipeId', (req, res) => {
  const recipeId = req.params.recipeId;
  const options = {
    method: 'GET',
    url: 'https://yummly2.p.rapidapi.com/feeds/list-similarities',
    params: {
      limit: '18',
      start: '0',
      id: recipeId,
      apiFeedType: 'moreFrom',
      authorId: 'Yummly'
    },
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': API_HOST
    }
  };

  axios.request(options)
    .then(function (response) {
      res.json(response.data);
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

// Endpoint for tag list
app.get("/tags", async (req, res) => {
  try {
    const options = {
      method: "GET",
      url: "https://yummly2.p.rapidapi.com/tags/list",
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": API_HOST,
      },
    };
    const response = await axios.request(options);
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint for category list
app.get('/categories', async (req, res) => {
  try {
    const options = {
      method: 'GET',
      url: 'https://yummly2.p.rapidapi.com/categories/list',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST
      }
    };
    const response = await axios.request(options);
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
 
// End point for reviews
app.get('/reviews', async (req, res) => {
  try {
    const options = {
      method: 'GET',
      url: 'https://yummly2.p.rapidapi.com/reviews/list',
      params: {offset: '0', globalId: 'a8d6747a-bfaa-46a7-92fb-892e3f76b264', limit: '20'},
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST
      }
    };

    const response = await axios.request(options);
    console.log(response.data);
    res.send(response.data); // send the data to the client
  } catch (error) {
    console.error(error);

    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else if (error.request) {
      res.status(500).send('Error sending request to the server');
    } else {
      res.status(500).send('Unknown error occurred');
    }
  }
});


app.listen(PORT, ()=>{
  console.log(`server running at port:${PORT}`)
})