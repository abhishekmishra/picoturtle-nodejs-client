const axios = require('axios');
var ArgumentParser = require('argparse').ArgumentParser;

async function turtle_request(request_url) {
    // console.log('start -> ' + request_url);
    let res = await axios.get(request_url);
    let t = await res.data;
    // console.log('done  -> ' + request_url);
    return t;
}

class Turtle {
    constructor(options) {
        if (!options) options = {};
        if (!options.name) options.name = null;
        if (!options.host) options.host = "127.0.0.1";
        if (!options.port) options.port = "3000";
        if (!('bulk' in options)) options.bulk = true;
        if (!('bulk_limit' in options)) options.bulk_limit = 100;

        this.options = options;
        this.name = options.name;
        this.turtle_url = "http://" + options.host + ":" + options.port;
        // this.turtle_request = turtle_request;
    }

    async turtle_request(cmd, args = null, is_obj = false) {
        if ((this.options.bulk & cmd != 'create')) {
            let cargs = [];
            if (args !== null) {
                if (is_obj !== null & is_obj) {
                    let arg_obj = {};
                    for (var i = 0; i < args.length; i++) {
                        arg_obj[args[i].k] = args[i].v;
                    }
                    cargs.push(arg_obj);
                } else {
                    for (var i = 0; i < args.length; i++) {
                        cargs.push(args[i].v);
                    }
                }
            }
            let command = {
                cmd: cmd,
                args: cargs
            }
            // console.log(command);
            this.commands.push(command);
            if (this.commands.length >= this.options.bulk_limit | cmd == 'stop') {
                //drain the commands
                let res = await axios.post(this.turtle_url + '/turtle/' + this.name + '/commands', this.commands);
                // console.log('Draining ' + this.commands.length + ' commands for ' + this.name);
                this.commands = [];
                let t = await res.data;
                return t;
            }
        } else {
            // console.log('start -> ' + request_url);
            let request_url = '/turtle/';
            if (this.name != null) {
                request_url += this.name;
                request_url += '/';
            }
            request_url += cmd;
            if (args != null) {
                request_url += '?';
                for (var i = 0; i < args.length; i++) {
                    if (i > 0) {
                        request_url += '&';
                    }
                    request_url += args[i].k;
                    request_url += '=';
                    request_url += args[i].v;
                }
            }
            let res = await axios.get(this.turtle_url + request_url);
            let t = await res.data;
            // console.log('done  -> ' + request_url);
            return t;
        }
    }

    async init(name) {
        this.commands = [];

        if (this.name == null) {
            if (name == null) {
                let t = await this.turtle_request('create', [
                    { k: 'x', v: 250 },
                    { k: 'y', v: 250 }
                ]);
                this.name = t.name;
                // console.log('Created turtle with name ' + t.name);
                return t;
            } else {
                this.name = name;
            }
        }
    }

    async penup() {
        let t = await this.turtle_request('penup');
        // console.log('penup for - ' + t.name);
        return t;
    }

    async pendown() {
        let t = await this.turtle_request('pendown');
        // console.log('pendown for - ' + t.name);
        return t;
    }

    async penwidth(w) {
        let t = await this.turtle_request('penwidth', [
            { k: 'w', v: w }
        ]);
        // console.log('penwidth ' + w + ' for - ' + t.name);
        return t;
    }

    async stop() {
        let t = await this.turtle_request('stop');
        // console.log('stop for - ' + t.name);
        return t;
    }

    async clear() {
        let t = await this.turtle_request('clear');
        // console.log('clear for - ' + t.name);
        return t;
    }

    async forward(d) {
        let t = await this.turtle_request('forward', [
            { k: 'd', v: d }
        ]);
        // console.log('forward ' + d + ' for - ' + t.name);
        return t;
    }

    async left(a) {
        let t = await this.turtle_request('left', [
            { k: 'a', v: a }
        ]);
        // console.log('left ' + a + ' for - ' + t.name);
        return t;
    }

    async right(a) {
        let t = await this.turtle_request('right', [
            { k: 'a', v: a }
        ]);
        // console.log('right ' + a + ' for - ' + t.name);
        return t;
    }

    async pencolour(r, g, b) {
        let t = await this.turtle_request('pencolour', [
            { k: 'r', v: r },
            { k: 'g', v: g },
            { k: 'b', v: b }
        ], true);

        // console.log('colour [' + r + ', ' + g + ', ' + b + '] for - ' + t.name);
        return t;
    }
}

function parseArgs() {
    var parser = new ArgumentParser({
        version: '0.0.1',
        addHelp: true,
        description: 'picoturtle nodejs client'
    });
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
    return args;
}

function getPortFromArgs(args) {
    let port = "3000";
    if(args.port) {
        port = args.port;
    }
    return port;
}

function getNameFromArgs(args) {
    let name = null;
    if(args.name) {
        name = args.name;
    }
    return name;
}

async function create_turtle(options) {
    if (!options) options = {};
    if (!options.args) options.args = true;
    if (options.args) {
        let args = parseArgs();
        if (!options.port) options.port = getPortFromArgs(args);
        if (!options.name) options.name = getNameFromArgs(args);
    }

    //console.log('Create turtle options -> ' + JSON.stringify(options));

    if (typeof t === 'undefined' || t === null) {
        t = new Turtle(options);
        global.t = t;
    }

    await t.init(options.name);
}

async function pendown() {
    await t.pendown();
}

async function penup() {
    await t.penup();
}

async function clear() {
    await t.clear();
}

async function stop() {
    await t.stop();
}

async function penwidth(w) {
    await t.penwidth(w);
}

async function forward(d) {
    await t.forward(d);
}

async function right(a) {
    await t.right(a);
}

async function left(a) {
    await t.left(a);
}

async function pencolour(r, g, b) {
    await t.pencolour(r, g, b);
}

async function print(text) {
    console.log(text);
    if (!(typeof turtle_console_out === 'undefined' || turtle_console_out === null)) {
        turtle_console_out(text);
    }
    if (process.send) {
        process.send(text);
    }
}

module.exports.Turtle = Turtle;
// module.exports.t = t;
module.exports.create_turtle = create_turtle;
module.exports.pendown = pendown;
module.exports.penup = penup;
module.exports.clear = clear;
module.exports.stop = stop;
module.exports.penwidth = penwidth;
module.exports.forward = forward;
module.exports.right = right;
module.exports.left = left;
module.exports.pencolour = pencolour;
module.exports.print = print;