var ArgumentParser = require('argparse').ArgumentParser;
var { spawn } = require('child_process');

var parser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'picoturtle nodejs client'
});
parser.addArgument(
    ['-f', '--file'],
    {
        help: 'turtle script'
    }
);
parser.addArgument(
    ['-n', '--name'],
    {
        help: 'turtle name'
    }
);
parser.addArgument(
    ['-s', '--server'],
    {
        help: 'turtle server'
    }
);
parser.addArgument(
    ['-p', '--port'],
    {
        help: 'turtle server port'
    }
);
var args = parser.parseArgs();

let pargs = [args.file];
if(args.name) {
    pargs.push('-n');
    pargs.push(args.name);
}
if(args.server) {
    pargs.push('-s');
    pargs.push(args.server);
}
if(args.port) {
    pargs.push('-p');
    pargs.push(args.port);
}
console.log(pargs);
let p = spawn(process.execPath, pargs);
p.stdout.on('data', (data) => {
    console.log(`stdout -> ${data}`);
});
p.stderr.on('data', (data) => {
    console.log(`stderr -> ${data}`);
});
p.on('close', (code) => {
    console.log('process exited with code - ' + code);
});