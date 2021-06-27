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
          <li><a href="#what-is-css">What is CSS?</a></li>
          <li><a href="#css-and-html">CSS and HTML</a></li>
          <li><a href="#how-css-works">How CSS Works</a></li>
          <li><a href="#about-the-dom">About The DOM</a></li>
          <li><a href="#applying-css-to-html">Applying CSS to HTML</a></li>
          <li><a href="#whats-next">Whats Next</a></li>
        </ol>
      </nav>
    </div>
      <header id="main-header">
      <h1>HOLY_SHEET Documentation Page</h1>
    </header>
    <main id="main-doc">
      <section id="what-is-css" class="main-section">
        <header>
          <h2>What is CSS?</h2>
        </header>
        <article>
          <p>CSS is a language for specifying how documents are presented to users — how they are styled, laid out, etc.</p>
  
          <p>A document is usually a text file structured using a markup language — HTML is the most common markup language, but you will also come across other markup languages such as SVG or XML.</p>
          
          <p>Presenting a document to a user means converting it into a usable form for your audience. Browsers, like Firefox, Chrome or Internet Explorer, are designed to present documents visually, for example, on a computer screen, projector or printer.</p>
        </article>
      </section>
      <hr/>  
      <section id="css-and-html" class="main-section">
        <header>
          <h2>How does CSS affect HTML?</h2>
        </header>
        <article>
          <p>Web browsers apply CSS rules to a document to affect how they are displayed. A CSS rule is formed from:</p>
          <ul>
            <li>A set of properties, which have values set to update how the HTML content is displayed, for example I want my element's width to be 50% of its parent element, and its background to be red.</li>
            <li>A selector, which selects the element(s) you want to apply the updated property values to. For example, I want to apply my CSS rule to all the paragraphs in my HTML document.</li>
          </ul>
          <p>A set of CSS rules contained within a stylesheet determines how a webpage should look.</p>
          <h3>A quick CSS example</h3>
          <p>The above descriptions may or may not have made sense, so let&#x27;s make sure things are clear by presenting a quick example. First of all, let&#x27;s take a simple HTML document, containing an <code>&#x3C;h1&#x3E;</code> and a <code>&#x3C;p&#x3E;</code> (notice that a stylesheet is applied to the HTML using a <code>&#x3C;link&#x3E;</code> element):</p>
          <p class="block lang-html">&#x3C;<span>!DOCTYPE html</span>&#x3E;
            <br/>&#x3C;<span>html</span>&#x3E;
            <br/>&emsp;&emsp;&#x3C;<span>head</span>&#x3E;
            <br/>&emsp;&emsp;&emsp;&emsp;&#x3C;<span>meta charset=&#x22;utf-8&#x22;</span>&#x3E;
            <br/>&emsp;&emsp;&emsp;&emsp;&#x3C;<span>title</span>&#x3E;My CSS experiment&#x3C;<span>/title</span>&#x3E;
            <br/>&emsp;&emsp;&emsp;&emsp;&#x3C;<span>link rel=&#x22;stylesheet&#x22; href=&#x22;style.css&#x22;</span>&#x3E;
            <br/>&emsp;&emsp;&#x3C;<span>/head</span>&#x3E;
            <br/>&emsp;&emsp;&#x3C;<span>body</span>&#x3E;
            <br/>&emsp;&emsp;&emsp;&emsp;&#x3C;<span>h1</span>&#x3E;Hello World!&#x3C;/<span>h1</span>&#x3E;
            <br/>&emsp;&emsp;&emsp;&emsp;&#x3C;<span>p</span>&#x3E;This is my first CSS example&#x3C;<span>/p</span>&#x3E;
            <br/>&emsp;&emsp;&#x3C;<span>/body</span>&#x3E;
            <br/>&#x3C;<span>/html</span>&#x3E;</p>
          <p>Now let's look at a very simple CSS example containing two rules:</p>
          <p class="block lang-css"><span class="h">h1</span> {
            <br/>&emsp;&emsp;<span>color</span>: blue;
            <br/>&emsp;&emsp;<span>background-color</span>: yellow;
            <br/>&emsp;&emsp;<span>border</span>: 1px solid black;
            <br/>}
            <br/><span class="h">p</span> {
            <br/>&emsp;&emsp;<span>color</span>: red;
            <br/>}
          </p>
          <p>The first rule starts with an <code>h1</code> selector, which means that it will apply its property values to the <code>&#x3C;h1&#x3E;</code> element. It contains three properties and their values (each property/value pair is called a declaration):</p>
          <ol>
            <li>The first one sets the text color to blue.</li>
            <li>The second sets the background color to yellow.</li>
            <li>The third one puts a border around the header that is 1 pixel wide, solid (not dotted, or dashed, etc.), and colored black.
  </li>
          </ol>
          <p>The second rule starts with a <code>p</code> selector, which means that it will apply its property values to the <code>&#x3C;p&#x3E;</code> element. It contains one declaration, which sets the text color to red.</p>
        </article>
      </section>
      <hr/>
      <section id="how-css-works" class="main-section">
        <header>
          <h2>How does CSS actually work?</h2>
        </header>
        <article>
          <p>When a browser displays a document, it must combine the document's content with its style information. It processes the document in two stages:</p>
          <ol>
            <li>
              The browser converts HTML and CSS into the DOM (Document Object Model). The DOM represents the document in the computer's memory. It combines the document's content with its style.
            </li>
            <li>The browser displays the contents of the DOM.</li>
          </ol>
          <img src="https://mdn.mozillademos.org/files/11781/rendering.svg" />
        </article>
      </section>
      <hr/>
       <section id="about-the-dom" class="main-section">
        <header>
          <h2>About the DOM</h2>
        </header>
        <article>
          <p>A DOM has a tree-like structure. Each element, attribute and piece of text in the markup language becomes a DOM node in the tree structure. The nodes are defined by their relationship to other DOM nodes. Some elements are parents of child nodes, and child nodes have siblings.</p>
          <p>Understanding the DOM helps you design, debug and maintain your CSS because the DOM is where your CSS and the document's content meet up.</p>
          <h3>DOM representation</h3>
          <p>Rather than a long, boring explanation, let's take an example to see how the DOM and CSS work together.</p>
          <p>Let's assume the following HTML code:</p>
          <p class="block lang-html">&#x3C;<span>p</span>&#x3E;
            <br/>Let&#x27;s use:
            <br/>&emsp;&emsp;&#x3C;<span>span&#x3E;</span>Cascading&#x3C;<span>/span</span>&#x3E;
            <br/>&emsp;&emsp;&#x3C;<span>span</span>&#x3E;Style&#x3C;<span>/span</span>&#x3E;
            <br/>&emsp;&emsp;&#x3C;<span>span</span>&#x3E;Sheets&#x3C;<span>/span</span>&#x3E;
            <br/>&#x3C;<span>/p</span>&#x3E;</p>
          <p>In the DOM, the node corresponding to our <code>&#x3C;p&#x3E;</code> element is a parent. Its children are a text node and the nodes corresponding to our <code>&#x3C;span&#x3E;</code> elements. The SPAN nodes are also parents, with text nodes as their children:</p>
          <p class="block">P
            <br/>&#x251C;&#x2500; &#x22;Let&#x27;s use:&#x22;
            <br/>&#x251C;&#x2500; SPAN
            <br/>| &emsp; &#x2514;&#x2500; &#x22;Cascading&#x22;
            <br/>&#x251C;&#x2500; SPAN
            <br/>| &emsp; &#x2514;&#x2500; &#x22;Style&#x22;
            <br/>&#x2514;&#x2500; SPAN
            <br/>&emsp;&emsp;&emsp;&emsp;&#x2514;&#x2500; &#x22;Sheets&#x22;</p>
          <p>This is how a browser interprets the previous HTML snippet —it renders the above DOM tree and then outputs it in the browser like so:</p>
          <p class="example">Let's use: Cascading Style Sheets</p>
          <h3>Applying CSS to the DOM</h3>
          <p>Let's say we added some CSS to our document, to style it. Again, the HTML is as follows:</p>
          <p class="block lang-html">&#x3C;<span>p</span>&#x3E;
            <br/>Let&#x27;s use:
            <br/>&emsp;&emsp;&#x3C;<span>span&#x3E;</span>Cascading&#x3C;<span>/span</span>&#x3E;
            <br/>&emsp;&emsp;&#x3C;<span>span</span>&#x3E;Style&#x3C;<span>/span</span>&#x3E;
            <br/>&emsp;&emsp;&#x3C;<span>span</span>&#x3E;Sheets&#x3C;<span>/span</span>&#x3E;
            <br/>&#x3C;<span>/p</span>&#x3E;</p>
          <p>If we apply the following CSS to it:</p>
          <p class="block lang-css"><span class="h">span</span> {
            <br/>&emsp;&emsp;<span>border</span>: 1px solid black;
            <br/>&emsp;&emsp;<span>background-color</span>: lime;
            <br/>}
          </p>
          <p>The browser will parse the HTML and create a DOM from it, then parse the CSS. Since the only rule available in the CSS has a <code>span</code> selector, it will apply that rule to each one of the three spans. The updated output is as follows:</p>
          <p id="span-example" class="example">Let's use: <span>Cascading</span> <span>Style</span> <span>Sheets</span></p>
        </article>
      </section>
      <section id="applying-css-to-html" class="main-section">
        <header>
          <h2>How to apply your CSS to your HTML</h2>
        </header>
        <article>
          <p>There are three different ways to apply CSS to an HTML document that you'll commonly come across, some more useful than others. Here we'll briefly review each one.</p>
          <h3>External stylesheet</h3>
          <p>You&#x27;ve already seen external stylesheets in this article, but not by that name. An external stylesheet is when you have your CSS written in a separate file with a ".css" extension, and you reference it from an HTML <code>&#x3C;link&#x3E;</code> element. The HTML file looks something like this:</p>
          <p class="block lang-html">&#x3C;!DOCTYPE html&#x3E;
            <br/>&#x3C;<span>html</span>&#x3E;
            <br/>&emsp;&emsp;&#x3C;<span>head</span>&#x3E;
            <br/>&emsp;&emsp;&emsp;&emsp;&#x3C;<span>meta charset=&#x22;utf-8&#x22;</span>&#x3E;
            <br/>&emsp;&emsp;&emsp;&emsp;&#x3C;<span>title</span>&#x3E;My CSS experiment&#x3C;<span>/title</span>&#x3E;
            <br/>&emsp;&emsp;&emsp;&emsp;&#x3C;<span>link rel=&#x22;stylesheet&#x22; href=&#x22;style.css&#x22;</span>&#x3E;
            <br/>&emsp;&emsp;&#x3C;<span>/head</span>&#x3E;
            <br/>&emsp;&emsp;&#x3C;<span>body</span>&#x3E;
            <br/>&emsp;&emsp;&emsp;&emsp;&#x3C;<span>h1</span>&#x3E;Hello World!&#x3C;<span>/h1</span>&#x3E;
            <br/>&emsp;&emsp;&emsp;&emsp;&#x3C;<span>p</span>&#x3E;This is my first CSS example&#x3C;<span>/p</span>&#x3E;
            <br/>&emsp;&emsp;&#x3C;<span>/body</span>&#x3E;
            <br/>&#x3C;<span>/html</span>&#x3E;</p>
          <p>And the CSS file:</p>
          <p class="block lang-css"><span class="h">h1</span> {
            <br/>&emsp;&emsp;<span>color</span>: blue;
            <br/>&emsp;&emsp;<span>background-color</span>: yellow;
            <br/>&emsp;&emsp;<span>border</span>: 1px solid black;
            <br/>}
            <br/><span class="h">p</span> {
            <br/>&emsp;&emsp;<span>color</span>: red;
            <br/>}
          </p>
          <p>This method is arguably the best, as you can use one stylesheet to style multiple documents, and would only need to update the CSS in one place if changes were needed.</p>
          <h3>Internal stylesheet</h3>
          <p>An internal stylesheet is where you don&#x27;t have an external CSS file, but instead place your CSS inside a <code>&#x3C;style&#x3E;</code> element, contained inside the HTML head. So the HTML would look like this:</p>
          <p class="block lang-html">&#x3C;<span>!DOCTYPE html</span>&#x3E;
            <br/>&#x3C;<span>html</span>&#x3E;
            <br/>&emsp;&emsp;&#x3C;<span>head</span>&#x3E;
            <br/>&emsp;&emsp;&emsp;&emsp;&#x3C;<span>meta charset=&#x22;utf-8&#x22;</span>&#x3E;
            <br/>&emsp;&emsp;&emsp;&emsp;&#x3C;<span>title</span>&#x3E;My CSS experiment&#x3C;<span>/title</span>&#x3E;
            <br/>&emsp;&emsp;&#x3C;<span>/head</span>&#x3E;
            <br/>&emsp;&emsp;&#x3C;<span>body</span>&#x3E;
            <br/>&emsp;&emsp;&emsp;&emsp;&#x3C;<span>h1 style=&#x22;color: blue;background-color: yellow;border: 1px solid black;&#x22;</span>&#x3E;Hello World!&#x3C;<span>/h1</span>&#x3E;
            <br/>&emsp;&emsp;&emsp;&emsp;&#x3C;<span>p style=&#x22;color:red;&#x22;</span>&#x3E;This is my first CSS example&#x3C;<span>/p</span>&#x3E;
            <br/>&emsp;&emsp;&#x3C;<span>/body</span>&#x3E;
            <br/>&#x3C;<span>/html</span>&#x3E;</p>
          <p>Please don't do this, unless you really have to! It is really bad for maintenance (you might have to update the same information multiple times per document), and it also mixes your presentational CSS information with your HTML structural information, making the CSS harder to read and understand. Keeping your different types of code separated and pure makes for a much easier job for all who work on the code.</p>
          <p>The only time you might have to resort to using inline styles is when your working environment is really restrictive (perhaps your CMS only allows you to edit the HTML body.)</p>
        </article>
      </section>
      <hr/>
      <section id="whats-next" class="main-section">
        <header>
          <h2>What's next</h2>
        </header>
        <article>
          <p>At this point you should understand the basics of how CSS works, and how browsers deal with it. Here are some great resources to learn more about CSS:</p>
          <ul>
            <li><a href="https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS" target="_blank">Introduction to CSS<a></li>
            <li><a href="https://www.w3schools.com/Css/default.asp" target="_blank">CSS Tutorial<a></li>
            <li><a href="https://cssreference.io/" target="_blank">Visual Guide to CSS<a></li>
          </ul>
        </article>
      </section>
    </main>
    <footer id="footer">
      <a href="https://github.com/nyctonio/HOLY_SHEET_REST_API" target_"blank">Documentation source used for this project</a>
    </footer>
  </div>
    </body>
    </html>
    `);
})


app.listen(port,() =>{
    console.log("server running");
});
