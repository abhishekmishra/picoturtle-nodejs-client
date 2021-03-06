const sync_request = require('sync-request');
var ArgumentParser = require('argparse').ArgumentParser;

function turtle_request_sync(request_url) {
    // console.log('start -> ' + request_url);
    let res = sync_request('GET', request_url);
    let t = JSON.parse(res.getBody('utf8'));;
    // console.log('done  -> ' + request_url);
    return t;
}

class Turtle {
    constructor(options) {
        if (!options) options = {};
        if (!options.name) options.name = null;
        if (!options.host) options.host = "127.0.0.1";
        if (!options.port) options.port = "3000";

        this.name = options.name;
        this.turtle_url = "http://" + options.host + ":" + options.port;
        this.turtle_request = turtle_request_sync;

        if (this.name == null) {
            this.init(null);
        }
    }

    init(name) {
        if (this.name == null) {
            if (name == null) {
                let t = this.turtle_request(this.turtle_url + '/turtle/create?x=250&y=250');
                this.name = t.name;
                // console.log('Created turtle with name ' + t.name);
                return t;
            } else {
                this.name = name;
            }
        }
    }

    penup() {
        let t = this.turtle_request(this.turtle_url + '/turtle/' + this.name + '/penup');
        // console.log('penup for - ' + t.name);
        return t;
    }

    pendown() {
        let t = this.turtle_request(this.turtle_url + '/turtle/' + this.name + '/pendown');
        // console.log('pendown for - ' + t.name);
        return t;
    }

    penwidth(w) {
        let t = this.turtle_request(this.turtle_url + '/turtle/' + this.name + '/penwidth?w=' + w);
        // console.log('penwidth ' + w + ' for - ' + t.name);
        return t;
    }

    stop() {
        let t = this.turtle_request(this.turtle_url + '/turtle/' + this.name + '/stop');
        // console.log('stop for - ' + t.name);
        return t;
    }

    clear() {
        let t = this.turtle_request(this.turtle_url + '/turtle/' + this.name + '/clear');
        // console.log('clear for - ' + t.name);
        return t;
    }

    forward(d) {
        let t = this.turtle_request(this.turtle_url + '/turtle/' + this.name + '/forward?d=' + d);
        // console.log('forward ' + d + ' for - ' + t.name);
        return t;
    }

    left(a) {
        let t = this.turtle_request(this.turtle_url + '/turtle/' + this.name + '/left?a=' + a);
        // console.log('left ' + a + ' for - ' + t.name);
        return t;
    }

    right(a) {
        let t = this.turtle_request(this.turtle_url + '/turtle/' + this.name + '/right?a=' + a);
        // console.log('right ' + a + ' for - ' + t.name);
        return t;
    }

    pencolour(r, g, b) {
        let t = this.turtle_request(this.turtle_url + '/turtle/' + this.name + '/pencolour?r=' + r + '&g=' + g + '&b=' + b);
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

function create_turtle(options) {
    if (!options) options = {};
    if (!options.args) options.args = true;
    if (options.args) {
        let args = parseArgs();
        if (!options.port) options.port = getPortFromArgs(args);
        if (!options.name) options.name = getNameFromArgs(args);
    }

    console.log('Create turtle options -> ' + JSON.stringify(options));

    if (typeof t === 'undefined' || t === null) {
        t = new Turtle(options);
        global.t = t;
    }
    t.init(options.name);
}

function pendown() {
    t.pendown();
}

function penup() {
    t.penup();
}

function clear() {
    t.clear();
}

function stop() {
    t.stop();
}

function penwidth(w) {
    t.penwidth(w);
}

function forward(d) {
    t.forward(d);
}

function right(a) {
    t.right(a);
}

function left(a) {
    t.left(a);
}

function pencolour(r, g, b) {
    t.pencolour(r, g, b);
}

function print(text) {
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