#!/usr/bin/env node

/*
 * living
 *
 * Copyright(c) 2014 André König <andre.koenig@posteo.de>
 * MIT Licensed
 *
 */

/**
 * @author André König <andre.koenig@posteo.de>
 *
 */

'use strict';

var fs = require('fs');
var path = require('path');
var url = require('url');
var http = require('http-https');
var Table = require('cli-table');
var pkg = require('./package.json');

var config = process.argv[2] || path.join(process.cwd(), 'living.json');
var creatures;

function error (message) {
    return console.error('%s - %s'.red, pkg.name, message);
}

function refresh () {
    var table = new Table({
        head: ['Name'.blue, 'URI'.blue, 'Alive?'.blue, 'HTTP status'.blue, 'Check interval (in ms)'.blue]
    });

    creatures.forEach(function (creature) {
        var notok = [
            creature.name.red,
            creature.uri.red,
            'Offline'.red,
            (creature.status || '-').toString().red,
            creature.interval.toString().red
        ];

        var ok = [
            creature.name.green,
            creature.uri.green,
            'Online'.green,
            (creature.status || '-').toString().green,
            creature.interval.toString().green
        ];

        table.push(creature.online? ok : notok);
    });

    console.log('\u001b[2J\u001b[0;0H');
    console.log(table.toString());
}

function check (creature) {
    function success (res) {
        creature.online = true;
        creature.status = res.statusCode;
    }

    function fail () {
        creature.online = false;
    }

    return function () {
        var options = url.parse(creature.uri);
        options.rejectUnauthorized = false;

        http.request(options, success)
        .on('error', fail)
        .end();
    };
}

function start (err, config) {
    var i = 0;
    var len = 0;
    var creature;

    if (err) {
        return error('Error while opening configuration file: ' + err.message);
    }

    try {
        creatures = JSON.parse(config);
    } catch (err) {
        return error('Error while parsing configuration file: ' + err);
    }

    len = creatures.length;

    for (i; i < len; i = i + 1) {
        creature = creatures[i];

        creature.name = creature.name || creature.uri;

        setInterval(check(creature), creature.interval || 1000);
    }
    
    setInterval(refresh, 1000);
}

fs.readFile(config, start);