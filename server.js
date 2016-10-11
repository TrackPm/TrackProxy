// This code is far from finished, its a concept currently
// This is not going to be super advanced and it relies quite heavilly the awesome
// libary from nodejitsu, we are litrelly just coding a nice system around it
//
// We know about nginx and haproxy but the problem with them is that we really dont know 
// much about configuring them beyond basic settings, by building our own system
// we can do things like dynamic host addition without having to worry about how to configure that
// feel free to do pull requests if you can improve our code, we love open source stuff

// Licence is currently the mozila public licence, but am not 100% sure which licence is best
// was going to use GNU but something put me off it, if you want to change the licence make a
// pull request that makes the change and gives a good explanation as to why its a good licence

var packagejson = require('./package.json'),
    http = require('http'),
    httpProxy = require('http-proxy'),
    proxy = httpProxy.createProxyServer({});

var port = 3001;

// Proxy setup
var server = http.createServer(function(req, res) {
    //TODO: Logic to pick server

    // If running in test mode then use servers created in mocha instead of defined servers
    if(process.env.NODE_ENV !== 'test') {
        proxy.web(req, res, { target: 'http://127.0.0.1:3000' });        
    } else {
        proxy.web(req, res, { target: 'http://127.0.0.1:4000' });
    }
});


// 504 error handler
// TODO: Figure out a way to try another server instead of just displaying an error
// probably as simple as just doing proxy.web in this block, but need to be sure not to cause loops
proxy.on('error', function (err, req, res) {
  res.writeHead(504, {
    'Content-Type': 'text/html'
  });

  res.end('<h1>ERROR 504 GATEWAY TIMEOUT</h1><hr><br>No servers can handle your request<br>Try again in 30 seconds, this error usually ocours if the is a high load on the website <br><br><code>Debug info<br>'+err+'<br>server removed to prevent a major disaster<br>will re-add if we get a heartbeat</code><br><br><h4>TrackProxy</h4>');
});


// Display no servers error if the are no servers to pick from
// Would happen usually if all the servers are down and would be removed from the pool 
function noserverfound(req, res) {
    res.writeHead(503, {
        'Content-Type': 'text/html'
    });
    res.end('<h1>ERROR 503 SERVICE UNAVAILABLE</h1><hr><br>No servers can handle your request<br>Try again in 30 seconds, this error usually ocours if the is a high load on the website <br><br><code>Debug info<br>No servers in proxy pool, no where to go<br>waiting for a backend server to be added</code><br><br><h4>TrackProxy</h4>');
}

// Display console info
// but not for mocha test
if(process.env.NODE_ENV !== 'test') {
    console.log('');
console.log('████████╗██████╗  █████╗  ██████╗██╗  ██╗           ██████╗ ███╗   ███╗');
console.log('╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝           ██╔══██╗████╗ ████║');
console.log('   ██║   ██████╔╝███████║██║     █████╔╝            ██████╔╝██╔████╔██║');
console.log('   ██║   ██╔══██╗██╔══██║██║     ██╔═██╗            ██╔═══╝ ██║╚██╔╝██║');
console.log('   ██║   ██║  ██║██║  ██║╚██████╗██║  ██╗    ██╗    ██║     ██║ ╚═╝ ██║');
console.log('   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝    ╚═╝    ╚═╝     ╚═╝     ╚═╝');
                                                                       


    console.log('TrackProxy v'+packagejson.version);
    console.log('listening on port '+port);
    console.log('');
}
server.listen(port);