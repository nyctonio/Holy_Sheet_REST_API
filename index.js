const express = require('express');
const port = process.env.PORT || 3000;
const bodyparser=require("body-parser");
const {google} = require('googleapis');
const app = express();
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

const keys = require('./keys.json');

const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

async function gsrun(data){
    const [cl,id1,id2,spreadid]=data;
    const gsapi = google.sheets({version:'v4',auth:cl});

    const opt ={
        spreadsheetId:spreadid,
        range:`${id1}:${id2}`
    }

    let response = await gsapi.spreadsheets.values.get(opt);

    console.log(response.data.values);
    return response;
}

// https://docs.google.com/spreadsheets/d/1GQjQbcbbOKu3qk2Wr6a2iqakaeM7Nx76FGDGbfGXqAE/edit#gid=0
// https://docs.google.com/spreadsheets/d/1qZVTmeXVBjAxX2zDvaJ3VCz9wkm2PafdlDDN3jO22aQ/edit#gid=0

app.get('/:id1/:id2/:id3',(req,res)=>{
    const data=[req.params.id1,req.params.id2,req.params.id3]

    function senddata(){
        let response = 'no data recived';
        client.authorize(async function(err,tokens){
            if(!err){
                console.log('Connected');
                const tosend = [client,...data];
                response = await gsrun(tosend);
                res.send(response.data);
            }else{
                console.log(err);
                return;
            }
        })
    }
    senddata()
})

app.get('/',(req,res)=>{
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>HOLY_SHEET</title>
    </head>
    <style>
    html,body{
        font-family: Calibri, Arial, Helvetica;
        margin: 0;
        padding: 0;
        background-color: #EEE;
      }
      #wrapper {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 300px 1fr;
        box-shadow: 0 1px 2px #777;
        background-color: #FFF;
      }
      
      /* TYPOGRAPHY */
      h1 {
        margin: 30px;
      }
      code {
        font-family: monospace;
        background-color: #DDD;
        color: #000;
        padding: 1px 4px;
        border-radius: 0px;
        text-shadow: 0 1px 2px #FFF;
        box-shadow: 0 1px 2px #000;
      }
      .block {
        font-family: monospace;
        background-color: #333;
        color: #fff;
        padding: 1px 4px;
        border-radius: 3px;
        text-shadow: 0 1px 2px #000;
        box-shadow: 0 1px 2px #777;
      }
      .block {
        padding: 10px;
      }
      .lang-html span {
        color: #F77;
      }
      .lang-css span {
        color: #7AF;
      }
      .lang-css span.h {
        color: #FD0;
      }
      
      /* NAVIGATION */
      #navbar{
        position: fixed;
        width: 300px;
        background-color: #DDD;
      }
      #navbar svg {
        width: 100px;
        height: auto;
        margin-top: 30px;
        margin-bottom: 10px;
        margin-left: 100px;
      }
      #navbar ol {
        list-style: none;
        margin:0;
        padding:0;
        background-color: #fff;
        font-family: Verdana;
      }
      #navbar ol li {display: block;}
      #navbar ol li:first-child {
        border-top: 1px solid #DDD;
      }
      #navbar ol li a{
        position: relative;
        display: block;
        padding: 10px;
        text-decoration: none;
        font-size: 14px;
        transition: all .15s ease-out;
        text-align: center;
        text-shadow: 0 1px 2px #FFF;
        border-bottom: 1px solid #DDD;
        color: #44F;
      }
      #navbar ol li a:visited {
        color: #44F;
      }
      #navbar ol li a:hover {
        box-shadow: 0 2px 2px #777;
        transform: translateY(-2px);
        background-color: #EEE;
      }
      
      /* MAIN */
      #main-header {
        background-color: #DDD;
      }
      main {
        padding: 20px;
        border-left: 1px dotted #999;
        grid-column: 2/-1;
      }
      hr {
        margin: 20px auto;
      }
      .example {
        padding: 20px;
        border: 1px solid #777;
        border-radius: 3px;
      }
      #span-example span {
        border: 1px solid black;
        background-color: lime;
      }
      
      /* FOOTER */
      #footer {
        grid-column: span 2;
        padding: 20px;
        background: #444;
      }
      #footer a {
        display: block;
        text-align: center;
        color: #FFF;
        text-shadow: 0 1px 2px #000;
      }
      
      /* MOBILE */
      @media (max-width: 860px) {
        #wrapper {
          grid-template-columns: 1fr;
        }
        #navbar {
          position: relative;
          width: 100%;
        }
        #navbar svg {
          display: block;
          width: 100px;
          margin: 0 auto;
          padding: 20px;
        }
        #main-header {
          grid-column: 1/-1;
        }
        main {
          grid-column: 1/-1;
        }
      }
    </style>
    <body>
    <div id="wrapper">
    <div id="nav-wrapper">
      <nav id="navbar">
        <header>
        <div style="display:flex;align-items:center;justify-content:center">
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/ae/Google_Sheets_2020_Logo.svg" width=100 height=200 alt="sheet_svg"/>
        </div>
        </header>
        <ol>
          <li><a href="#what-is-holysheetapi">What is HOLY_SHEET API?</a></li>
          <li><a href="#how-to-use">How to use the API</a></li>
        </ol>
      </nav>
    </div>
      <header id="main-header">
      <h1>HOLY_SHEET Documentation Page</h1>
    </header>
    <main id="main-doc">
      <section id="what-is-holysheetapi" class="main-section">
        <header>
          <h2>What is HOLY_SHEET API?</h2>
        </header>
        <article>
          <p>This Api is basically made so that you can import you google sheets data as a JSON object.</p>
  
          <p>And you can use this api for making you Google sheet as a database LOL 😂 a free database with world class User Interface.</p>
        </article>
      </section>
      <hr/>  
      <section id="how-to-use" class="main-section">
        <header>
          <h2>How to use HOLY_SHEET API?</h2>
        </header>
        <article>
          <p>First We have to make a Google sheet and make the link available for public.
          </p>
          <p>Than We can Use 3 things to query for our data</p>
          <ol>
            <li>
            Starting Row no eg-> A1
            </li>
            <li>Ending Column no eg-> C5.</li>
            <li>sheet id eg -> 
            https://docs.google.com/spreadsheets/d/ --> 1qZVTmeXVBjAxX2zDvaJ3VCz9wkm2PafdlDDN3jO22aQ  <-- /edit?usp=sharing
            this is Your sheet ID</li>
          </ol>
          <p>You can Query <p/>
          <p/>
          https://holy-sheet-api.herokuapp.com/ {startingrow} / {endingcolumn} / {sheetid} </p>
          <p/>
          example ->  https://holy-sheet-api.herokuapp.com/A1/B3/1qZVTmeXVBjAxX2zDvaJ3VCz9wkm2PafdlDDN3jO22aQ<p/>
        
          <p class="block lang-html">
            {<br>
              &nbsp &nbsp &nbsp"range":"Sheet1!A1:B3",<br>
              &nbsp &nbsp &nbsp"majorDimension":"ROWS",<br>
              &nbsp &nbsp &nbsp"values":[<br>
              &nbsp &nbsp &nbsp  ["title","content"],<br>
              &nbsp &nbsp &nbsp  ["Lorem-1","A set of properties, which have values set to update how the HTML content is displayed,for example &nbsp &nbsp &nbsp I want my element's width to be 50% of its parent element, and its background to be red."],<br>
              &nbsp &nbsp &nbsp  ["Lorem-1","Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the &nbsp &nbsp &nbsp industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled"]]<br>
            }
          </p>
          </article>
      </section>
    </main>
    <footer id="footer">
      <a href="https://github.com/nyctonio/HOLY_SHEET_REST_API" target_"blank">To Understand Better Check The Github Repo</a>
    </footer>
  </div>
    </body>
    </html>
    `);
})


app.listen(port,() =>{
    console.log("server running");
});
