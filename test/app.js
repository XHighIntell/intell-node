'use strict';

global.process.env["NODE_PATH"] = "C:\\node\\node_modules";
require("module").Module._initPaths();


const FS = require('fs');
const Path = require('path');
const Process = require('process');
const Intell = require('intell-node');
const Console = Intell.Console;




"msbuild.exe [parameters] [Switches]"
"msbuild.exe 'a sds sd sd' -mode:12 -clear=false"

//var s = Intell.Diagnostics.CreateArguments("build -mode=dev -clear");

var s = Intell.Diagnostics.ParseArguments();
var s = Intell.Diagnostics.ParseArguments('-clear:"ad \\" sa" -mode:development "a \\" asd" "123 456"');




//var ss = require('intell-node2');

//Intell.Console.SelectBoolean()

!function() {
    //return;
    var Console = Intell.Console;

    
    Console.Clear();
    //console.log('=====================');
    Console.WriteLine('=====================');
    Console.WriteLine('Hello5');
    Console.WriteLine("aaaa");

    Console.ReadKey().then(function(e) {
        //Console.WriteLine(e);
    }).then(function() {
        Console.WriteLine("Encrypt node:")
        return Console.SelectMenu({ items: [{ name: "aaaaaaa", description: "1111111111" }, { name: "bbbbbbbbb", description: "2222222222" }] })
    }).then(function() {

        //return Console.SelectMenu({ items: [{ name: "aaaaaaa", description: "1111111111" }, { name: "bbbbbbbbb", description: "2222222222" }] })
        //Console.Write("asd");
        return Console.SelectEnum({ items: [{ name: "asd" }, { name: "vvvv" }] });
    }).then(function() {
        return Console.SelectEnum({ items: [{ name: "asd" }, { name: "vvvv" }] });
    }).then(function() {
        
    });

    

    process.title = Console.CursorLeft + ';' + Console.CursorTop;


}()

//Console.WriteLine(Intell.colors.fg(41) + "aaa");
//console.log('\x1b[38;2;255;0;0;m' + "adasdad");

!function() {
    function aa() {
        Console.ReadKey().then(function(e) {

            if (e.ctrlKey == true) Console.Write("Ctrl + ");
            if (e.altKey == true) Console.Write("Alt + ");
            if (e.shiftKey == true) Console.Write("Shift + ");

            
            if (e.keyCode == 27) {
                Console.Write('ESC');
            } else {
                Console.Write(e.keyChar);
            }
            Console.Write('  ');
            Console.WriteLine(e.buffer.toJSON());
            

            //Console.WriteLine(JSON.stringify(e));

            aa()
        })
    }
    aa();
    

}()

//setTimeout(function() { }, 123123)







