const http = require("http");
const fs = require("fs");
const configs = require("./configs.json");

// Create the server
http.createServer((request, response) => {
  request.on('error', (error) => handleRequestError(error, response) );
  response.on('error', (err) => handleResponseError(error, response) );
  handleHttpRequest(request, response);
}).listen(8000);

console.log(`Server running at http://localhost:8000`);

function getContentTypeHeader(path) {
  if (path.includes(".css")) { return "text/css"; }
  if (path.includes(".js")) { return "application/js"; }
  if (path.includes(".json")) { return "application/json"; }
  if (path.includes(".map")) { return "application/octet-stream"; }
  if (path.includes(".png")) { return "image/png"; }
  if (path.includes(".svg")) { return "image/svg+xml"; }
  if (path.includes(".woff")) { return "font/woff"; }
  if (path.includes(".woff2")) { return "font/woff2"; }
}

// Handle HTTP request errors
function handleRequestError(error, response) {
  console.error(error);
  response.statusCode = 400;
  response.end();
}

// Handle HTTP response errors
function handleResponseError(error, response) {
  console.error(error);
}

// Handle all requests. This just services the index.html file that holds the Vue application.
function handleHttpRequest(request, response) {
  if (
    request.url != "/favicon.ico"
    && !request.url.includes("css")
    && !request.url.includes("js")
    && !request.url.includes("json")
    && !request.url.includes("png")
    && !request.url.includes("svg")
    && !request.url.includes("woff")
    && !request.url.includes("woff2")
  ) {
    console.log(`${request.method} ${request.url}`);
  }

  response.writeHeader(200, {"Content-Type": "text/html"});  

  if (request.url == "/") {
    const html = fs.readFileSync("index.html");
    response.write(html);
  } else if (request.url == "/drash") {
    const html = fs.readFileSync("./drash/index.html");
    response.write(html);
  } else {
    const file = fs.readFileSync(`${configs.root_directory}${request.url}`);
    response.writeHead(200, {"Content-Type": getContentTypeHeader(request.url)});
    response.write(file);
  }
  response.end();
}
