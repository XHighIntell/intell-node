'use strict';

global.process.env["NODE_PATH"] = "C:\\node_modules";
require("module").Module._initPaths();


const FS = require('fs');
const Path = require('path');
const Process = require('process');
const Intell = require('intell-nodejs');



Intell.Console.SelectBoolean(null, { paddingLeft:10 }).then(function() {
    console.log();

    Intell.Console.SelectEnum({ items: [{ id: '111', name: '111' }, { id: '222', name: '222' }] });
})


setTimeout(function() { }, 2000000);
return;

Intell.Console.aaa().then(function() {
    console.log();
    console.log('asdasd');

    Intell.Console.aaa().then(function() {
        console.log();
        console.log('asdasd');
    })

}).then(function() {

});



//process.stdout.cursorTo()
//console.
var menu = new Intell.Console.Menu();
menu.x = 0;
menu.y = 2;

menu.items.push({ name: 'aaa', description: 'here is description for aaa' });
menu.items.push({ name: 'bbb', description: 'here is description for bbb' });

return menu.select().then(function(item) {
    var menu = new Intell.Console.Menu();
    menu.x = 0;
    menu.y = 2;
    
    menu.items.push({ name: 'sub aaa', description: 'here is description for aaa' });
    menu.items.push({ name: 'sub bbb', description: 'here is description for bbb' });
    return menu.select().then(function(item) { });
});
