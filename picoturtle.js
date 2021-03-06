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
            if (this.commands.length >= this.options.bulk_limit | cmd == 'stop' | cmd == 'state') {
                //drain the commands
                let res = await axios.post(this.turtle_url + '/turtle/' + this.name + '/commands', this.commands);
                // console.log('Draining ' + this.commands.length + ' commands for ' + this.name);
                this.commands = [];
                let t = await res.data;
                return t;
            } else {
                return Promise.resolve("turtle is async, so no state at the moment.");
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

    async back(d) {
        let t = await this.turtle_request('back', [
            { k: 'd', v: d }
        ]);
        // console.log('back ' + d + ' for - ' + t.name);
        return t;
    }

    async setpos(x, y) {
        let t = await this.turtle_request('goto', [
            { k: 'x', v: x },
            { k: 'y', v: y }
        ]);
        // console.log('goto ' + x + ', ' + y + ' for - ' + t.name);
        return t;
    }

    async setx(x) {
        let t = await this.turtle_request('setx', [
            { k: 'x', v: x }
        ]);
        // console.log('setx ' + x + ' for - ' + t.name);
        return t;
    }

    async sety(y) {
        let t = await this.turtle_request('sety', [
            { k: 'y', v: y }
        ]);
        // console.log('setx ' + x + ' for - ' + t.name);
        return t;
    }

    async home() {
        let t = await this.turtle_request('home');
        // console.log('home for - ' + t.name);
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

    async heading(a) {
        let t = await this.turtle_request('heading', [
            { k: 'a', v: a }
        ]);
        // console.log('heading ' + a + ' for - ' + t.name);
        return t;
    }

    async font(f) {
        let t = await this.turtle_request('font', [
            { k: 'f', v: f }
        ]);
        // console.log('font ' + f + ' for - ' + t.name);
        return t;
    }

    async filltext(text) {
        let t = await this.turtle_request('filltext', [
            { k: 't', v: text }
        ]);
        // console.log('filltext ' + t + ' for - ' + t.name);
        return t;
    }

    async stroketext(text) {
        let t = await this.turtle_request('stroketext', [
            { k: 't', v: text }
        ]);
        // console.log('stroketext ' + text + ' for - ' + t.name);
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

    async state() {
        let t = await this.turtle_request('state');
        // console.log('state for - ' + t.name);
        return t;
    }

    async canvas_size(width, height) {
        let t = await this.turtle_request('canvas_size', [
            { k: 'width', v: width },
            { k: 'height', v: height }
        ]);
        return t;
    }

    async export_img(filename) {
        let t = await this.turtle_request('export_img', [
            { k: 'filename', v: filename }
        ]);
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
    if (args.port) {
        port = args.port;
    }
    return port;
}

function getNameFromArgs(args) {
    let name = null;
    if (args.name) {
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
    return await t.pendown();
}

async function penup() {
    return await t.penup();
}

async function clear() {
    return await t.clear();
}

async function stop() {
    return await t.stop();
}

async function penwidth(w) {
    return await t.penwidth(w);
}

async function forward(d) {
    return await t.forward(d);
}

async function back(d) {
    return await t.back(d);
}

async function setpos(x, y) {
    return await t.setpos(x, y);
}

async function setx(x) {
    return await t.setx(x);
}

async function sety(y) {
    return await t.sety(y);
}

async function home() {
    return await t.home();
}

async function right(a) {
    return await t.right(a);
}

async function left(a) {
    return await t.left(a);
}

async function heading(a) {
    return await t.heading(a);
}

async function pencolour(r, g, b) {
    return await t.pencolour(r, g, b);
}

async function font(f) {
    return await t.font(f);
}

async function filltext(text) {
    return await t.filltext(text);
}

async function stroketext(text) {
    return await t.stroketext(text);
}

async function state() {
    return await t.state();
}

async function canvas_size(width, height) {
    return await t.canvas_size(width, height);
}

async function export_img(filename) {
    return await t.export_img(filename);
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
module.exports.create_turtle = create_turtle;
module.exports.pendown = pendown;
module.exports.penup = penup;
module.exports.clear = clear;
module.exports.stop = stop;
module.exports.penwidth = penwidth;
module.exports.forward = forward;
module.exports.back = back;
module.exports.setpos = setpos;
module.exports.setx = setx;
module.exports.sety = sety;
module.exports.home = home;
module.exports.right = right;
module.exports.left = left;
module.exports.heading = heading;
module.exports.pencolour = pencolour;
module.exports.print = print;
module.exports.font = font;
module.exports.filltext = filltext;
module.exports.stroketext = stroketext;
module.exports.state = state;
module.exports.canvas_size = canvas_size;
module.exports.export_img = export_img;
