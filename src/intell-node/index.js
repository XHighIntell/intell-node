

module.exports = function() {
    /** @type Intell.Namespace */
    var intell = {};

    const FS = require('fs');
    const Path = require('path');


    intell.colors = new function() {

        /** @type Intell.Colors */
        var _this; _this = this;
        
        _this.reset = '\x1b[0m';
        _this.fg = function(number) {
            return '\x1b[38;5;' + number + 'm';
        };
        _this.bg = function(number) {
            return '\x1b[48;5;' + number + 'm';
        }
        _this.removeAll = function(text) {
            text = text.replace(new RegExp('\x1b\\[0m', 'g'), '');
            text = removeBetween(text, '\x1b[38;5;', 'm');
            text = removeBetween(text, '\x1b[48;5;', 'm');

            return text;
        }

        /**@param {string} text @param {string} startsWith @param {string} endsWith */
        function removeBetween(text, startsWith, endsWith) {
            var startsWithIndex = -1;
            var endsWithIndex = -1;

            do {
                startsWithIndex = text.indexOf(startsWith);

                if (startsWithIndex != -1)
                    endsWithIndex = text.indexOf(endsWith, startsWithIndex + startsWith.length);
                else break;

                if (endsWithIndex != -1)
                    text = text.substring(0, startsWithIndex) + text.substring(endsWithIndex + endsWith.length);
                else break;

            } while (true);

            return text;
        }

    }();
    
    intell.IO = {}
    intell.IO.Directory = new function() {
        /** @type Intell.IO.Directory */
        var directory = this;


        directory.CreateDirectory = function(path) {
            var folders = []; // array folder need to be created

            var parent = path;

            while (true) {
                if (!parent) break;
                if (FS.existsSync(parent) == true) break;

                folders.unshift(parent)

                parent = directory.GetParent(parent);                
            }

            folders.forEach(function(path) {
                FS.mkdirSync(path);
            })
            
        }
        directory.GetParent = function(path) {
            var output = Path.resolve(path, '..');

            if (output.length == path.length) return null;

            return output;
        }

        directory.GetDirectories = function GetDirectories(path, allDirectories) {

            if (allDirectories == false) {
                return FS.readdirSync(path).map(function(name) {
                    return Path.resolve(path, name);
                }).filter(function(value) {
                    return FS.lstatSync(value).isDirectory();
                })
            } else {
                var folders = []

                FS.readdirSync(path).map(function(name) {
                    return Path.resolve(path, name);
                }).forEach(function(value) {
                    if (FS.lstatSync(value).isDirectory() == true) folders.push(value);
                });


                folders.forEach(function(value) {
                    Array.prototype.push.apply(folders, GetDirectories(value, allDirectories))
                });



                return folders;

            }

        }
        directory.GetFiles = function GetFiles(path, allDirectories) {

            if (allDirectories == false) {
                return FS.readdirSync(path).map(function(name) {
                    return Path.resolve(path, name);
                }).filter(function(value) {
                    return FS.lstatSync(value).isFile();
                });
            } else {
                var files = [];
                var folders = []

                FS.readdirSync(path).map(function(name) {
                    return Path.resolve(path, name);
                }).forEach(function(value) {
                    if (FS.lstatSync(value).isFile() == true)
                        files.push(value);
                    else
                        folders.push(value);
                });


                folders.forEach(function(value) {
                    Array.prototype.push.apply(files, GetFiles(value, allDirectories))
                });



                return files;
            }

            return FS.readdirSync(path).map(function(name) {
                return Path.resolve(path, name);
            }).filter(function(value) {
                return FS.lstatSync(value).isFile();
            });
        };
        directory.CopyDirectory = function(sourceDirectoryName, destinationDirectoryName) {
            // source = E:\AA
            // destin = E:\AA\BB\CC

            // source = E:\AA\BB\CC
            // destin = E:\AA

            // E:\AA\BB\CC\1.txt -> E:\AA\1.txt
            // E:\AA\BB\CC\2.txt -> E:\AA\2.txt


            if (destinationDirectoryName.toLowerCase().indexOf(sourceDirectoryName.toLowerCase()) == 0) throw "Can't copy parent folder to its children.";



            var srcFiles = directory.GetFiles(sourceDirectoryName, true);
            ///var dstFiles = [];

            srcFiles.forEach(function(src) {

                
                var dest = destinationDirectoryName + src.substr(sourceDirectoryName.length);
                directory.CreateDirectory(Path.dirname(dest));
                //dstFiles.push(destinationDirectoryName + src.substr(sourceDirectoryName.length));

                FS.copyFileSync(src, dest)
            })



        }
        directory.Exists = function(path) { return FS.existsSync(path); }
        directory.Delete = function(path, recursive) {
            FS.rmdirSync(path, { recursive: recursive });
        }

    }();
    intell.IO.File = new function() {
        /** @type Intell.IO.File */
        var file = this;
        
        file.Copy = function(sourceFileName, destFileName, overwrite) {
            FS.copyFileSync(sourceFileName, destFileName)
        }
        file.ReadAllText = function (path) {
            var data = FS.readFileSync(path, { encoding: 'utf-8' });
            var code = data.charCodeAt(0);

            if (code == 65279) data = data.substr(1);
            return data;
        }
        file.WriteAllText = function (path, contents, encoding) {
            FS.writeFileSync(path, contents, encoding);
        }
        file.Exists = function(path) { return FS.existsSync(path); }
        file.Delete = function(path) { FS.unlinkSync(path); }
    }();
    intell.IO.Path = new function() {
        /** @type Intell.IO.Path */
        var path = this;

        path.GetFileName = function(path) { return Path.basename(path); }
        path.GetFileNameWithoutExtension = function(path) {
            var name = Path.basename(path)
            var index = name.lastIndexOf('.');
            if (index == -1) return name;

            return name.substr(0, index);
        }
        path.GetExtension = function(path) {
            if (path == null) throw new Error("path can't be undefined");
            var name = Path.basename(path)
            var index = name.lastIndexOf('.');

            return name.substr(index);
        }
        path.GetDirectoryName = function(path) {
            if (path.endsWith("\\") || path.endsWith("/")) return Path.dirname(path + 'aa');

            return Path.dirname(path);
        }
        path.GetFullPath = function(path) { return Path.resolve(path); }
        

        path.Combine = function() {
            //return Path.resolve.apply(Path, arguments)

            var paths = Array.from(arguments)
            return paths.join(Path.sep);
        }

    }();

    intell.Diagnostics = new function() {
        /** @type Intell.Diagnostics.Namespace */
        var diagnostics; diagnostics = this;


        // methods
        diagnostics.ParseArguments = function(text) {

            // -mode:12 -clear:false -add:"a a"
            // -mode:12 -clear:false -add:'a a'

            // hard test
            // -mode:12 -clear:'false \'a "sds sd sd"'
            // build "kn"njkn "as\"as" "C:\New Folder"sasas -mode:12 -comment:'My name\'s Woody'

            // Error test
            // -mode:12 -clear:'false'thank '' you
            // -mode:12 -clear'asdas' 

            //-mode:12       <========= 2b
            //build          <========= 2b
            //"kn"njkn       <========= 2c
            //"C:\New        <========= 2d
            //Folder"sasas   
            //"as\"as"       <========= nextQuote handle this
            //-comment:'My   <========= 2d
            //name\'s
            //ABC'

            // if text is empty, set value = global.process.argv.slice(2) and move to step 4
            // 1. trim, split
            // 2. join the next texts into the current if possible
            //   a. find the first quote (' or ") and its position    
            //   b. if text do not contain ' or ", nothing to join; exit
            //   c. if text contain closing quote, split if necessary
            //   d. looking for nextQuote in next text
            // 3. filter empty
            // 4. parse values, then put them into arguments

            /** @type string[] */
            var values;

            if (text != null) {

                // --1--
                /** @type string[] */
                values = text.trim().split(' ');

                // --2--
                for (var i = 0; i < values.length; i++) join(i, values);

                // --3--
                values = values.filter(function(value) { return value != '' });

                for (var i = 0; i < values.length; i++) values[i] = unQuote(values[i]);
            }
            else values = global.process.argv.slice(2);


            // --4--
            /** @type Intell.Diagnostics.ArgumentsInfo */
            var arg = {
                parameters: values,
                commands: [],
                switches: {},
            };

            
            for (var i = 0; i < values.length; i++) {
                let value = values[i];

                //-mode:123              <=====  4a
                //-clear:"adasd\"asdasd" <=====  4a
                //-mode                  <=====  4b
                //build                     <=====  4c
                //"asdasd asdsad"             <=====  4c

                if (value.startsWith('-') == true) {
                    var colon_position = value.indexOf(':');
                    
                    if (colon_position != -1) {
                        // --4a--
                        var left = value.slice(1, value.indexOf(':'));
                        var right = unQuote(value.slice(value.indexOf(':') + 1));

                        arg.switches[left] = right;
                    } else {
                        // --4b--
                        var left = value.slice(1);
                        arg.switches[left] = true;
                    }
                } else {
                    var first = firstQuote(value);
                    var postion = first.position;

                    // --4c--
                    if (postion == -1) arg.commands.push(value);
                    else {
                        
                    }
                }
            }


            return arg;

            /** @param {number} index @param {string[]} array */
            function join(index, array) {


                var value = array[index];

                // --2a--
                var first = firstQuote(value);
                var position = first.position;
                var character = first.quote;

                // --2b--
                if (position == -1) return;


                position = nextQuote(value, character, position + 1);

                if (position != -1) {
                    // --2c--

                    // change current
                    array[index] = value.substr(0, position + 1);

                    // split if necessary
                    if (position < value.length - 1) array.splice(index + 1, 0, value.substr(position + 1));


                    return;
                }

                // --2d--
                for (var i = index + 1; i < array.length; i++) {
                    var nextValue = array[i];
                    position = nextQuote(nextValue, character, 0);

                    if (position == -1) {
                        value = value + " " + nextValue;
                        array.splice(i, 1);
                        i--;
                    } else {
                        //"C:\New 
                        //Folder" asdasd


                        // change current
                        array[index] = value + " " + nextValue.substr(0, position + 1);

                        // do we have remaining 
                        if (position < nextValue.length - 1)
                            array[i] = nextValue.substr(position + 1);
                        else
                            array.splice(i, 1);

                        return;
                    }


                }

                // if code reach here 
                array[index] = value + character;

                return;
            }

            /** @param {string} text */
            function firstQuote(text) {
                var quote = '';
                var a = text.indexOf('"');
                var b = text.indexOf("'");

                var position = Math.min(a, b);
                if (position == -1) position = Math.max(a, b);


                if (position == a) quote = '"';
                if (position == b) quote = "'";

                return { position: position, quote: quote };
            }

            /** Looking for the next quote character from the specified position
             * @param {string} text @param {string} quote @param {number} position */
            function nextQuote(text, quote, position) {
                if (position == null) position = 0;

                do {
                    var index = text.indexOf(quote, position);
                    position = index + 1;

                    if (index == -1) return -1;
                    else if (text.slice(index - 1, index) != '\\') return index;

                } while (index != -1);

                return -1;
            }

            /**@param {string} text */
            function unQuote(text) {

                var first = firstQuote(text);
                var { position, quote } = first;

                if (position == -1) return text;

                var end_pos = nextQuote(text, quote, position + 1);

                if (position == 0 && end_pos == text.length - 1) {
                    text = text.replace(new RegExp('\\\\' + quote, 'g'), quote);

                    return text.slice(1, -1);
                }

                return text;

            }
        }

    }();

    /** @type Intell.Console.Namespace */
    var Console = intell.Console = new function() {
        /** @type Intell.Console.Namespace */
        var Console; Console = this;
        
        Console.Menu = function() {

            /** @type Intell.Console.Menu */
            var _this = this;

            // property
            _this.items = [];
            _this.x = 0;
            _this.y = 0;
            _this.padding = 2;

            // fields
            var index = 0;

            // methods
            _this.draw = function() {
                for (var i = 0; i < _this.items.length; i++) {

                    var line = (i + 1).toString().padStart(_this.padding) + '. ';


                    if (i == index)
                        line = line + Console.bg(2) + _this.items[i].name + Console.reset;
                    else
                        line = line + _this.items[i].name;

                    Console.WriteLine(line);

                }

                //var readline = require('readline');
                //const rl = readline.createInterface({
                //    input: process.stdin, output: process.stdout
                //});
                //var pos = rl.getCursorPos();
                //var x = pos.rows;
                //var y = pos.cols;
                //process.stdout.moveCursor(x, y);

                var item = _this.items[index];
                process.stdout.clearScreenDown();

                if (item.description)
                    Console.WriteLine(item.description);

            }
            _this.select = function() {

                return new Promise(function(resolve, reject) {
                    //if (_this.x == null) _this.x = 0;
                    //if (_this.y == null) _this.y = 0;

                    var ondata = function(e) {
                        //console.log(e, e.byteLength);
                        //return;
                        //if (e[0] == 0x1b && e[1] == 0x5b && e[2] == 0x44) console.log('left');
                        //else if (e[0] == 0x1b && e[1] == 0x5b && e[2] == 0x41) console.log('top');
                        //else if (e[0] == 0x1b && e[1] == 0x5b && e[2] == 0x43) console.log('right');
                        //else if (e[0] == 0x1b && e[1] == 0x5b && e[2] == 0x42) console.log('bottom');


                        if (e[0] == 0x1b && e[1] == 0x5b && e[2] == 0x41) index--;
                        if (e[0] == 0x1b && e[1] == 0x5b && e[2] == 0x42) index++;
                        if (e[0] == 13) {
                            
                            process.stdin.removeListener('data', ondata);
                            //process.stdin.end();
                            //process.stdin.removeAllListeners('data');
                            
                            var item = _this.items[index]
                            process.stdin.pause();
                            
                            resolve(item);
                            return;
                        }

                        if (index < 0) { index = 0; return }
                        if (index >= _this.items.length) { index = _this.items.length - 1; return }

                        //var delta_x = Console.CursorLeft - _this.x;

                        
                        //process.stdout.cursorTo(_this.x, _this.y);
                        Console.SetCursorPosition(_this.x, _this.y);
                        //Console.SetCursorPosition(_this.x - Console.CursorLeft, _this.y - Console.CursorTop);
                        _this.draw();
                    }

                    index = 0;
                    process.stdin.setRawMode(true);

                    var p = process.stdin.isPaused();
                    process.stdin.addListener('data', ondata);


                    _this.x = Console.CursorLeft
                    _this.y = Console.CursorTop;

                    //process.stdout.cursorTo(_this.x, _this.y);
                    _this.draw();


                });


            }
        }
        Console.Enum = function() {

            /** @type Intell.Console.Enum */
            var _this = this;

            // fields
            var index = 0;

            // property
            /** @type Intell.Console.EnumItem[] */
            var items = [];
            var paddingLeft = 0;
            var gap = 0;
            var x = 0;
            var y = 0;

            Object.defineProperties(_this, {
                PaddingLeft: {
                    get: function() { return paddingLeft },
                    set: function(value) { paddingLeft = value }
                },
                Gap: {
                    get: function() { return gap },
                    set: function(value) { gap = value }
                },
                Items: {
                    get: function() { return items },
                    set: function(newValue) { throw new Error("Items is readonly.") }
                },

            });


            // methods
            _this.Draw = function() {
                Console.Write(' '.repeat(paddingLeft));

                for (var i = 0; i < items.length; i++) {
                    var item = items[i]
                    var name = '  ' + item.name + '  ';

                    if (index == i) Console.Write(Console.bg(2) + name + Console.reset);
                    else Console.Write(name);

                    if (i != items.length - 1)
                        Console.Write(' '.repeat(gap));
                }

                process.stdout.clearScreenDown();
            }
            _this.Select = function() {
                return new Promise(function(resolve, reject) {
                    var ondata = function(e) {
                        if (e[0] == 0x1b && e[1] == 0x5b && e[2] == 0x44)      index -= 1; // left
                        else if (e[0] == 0x1b && e[1] == 0x5b && e[2] == 0x43) index += 1; // right

                        if (index < 0) { index = 0; return; }
                        else if (index >= items.length) { index = items.length - 1; return; }


                        if (e[0] == 13) {
                            process.stdin.setRawMode(false);
                            process.stdin.removeListener('data', ondata);
                            process.stdin.pause();
                            resolve(items[index]);
                            return;
                        }

                        Console.SetCursorPosition(x, y);
                        _this.Draw();
                    }

                    index = 0;
                    process.stdin.setRawMode(true);
                    process.stdin.addListener('data', ondata);
                    process.stdin.resume();

                    x = Console.CursorLeft
                    y = Console.CursorTop;

                    //process.stdout.cursorTo(0);
                    _this.Draw();
                });
            }
        }

        // === properties ===
        var cursorLeft = 0;
        var cursorTop = 0;

        Object.defineProperties(Console, {
            CursorLeft: {
                get: function() { return cursorLeft },
                set: function(newValue) {
                    if (typeof (newValue) != 'number') throw new Error("Cannot implicitly convert type 'string' to 'number'");
                    cursorLeft = newValue;
                }
            },
            CursorTop: {
                get: function() { return cursorTop },
                set: function(newValue) {
                    if (typeof (newValue) != 'number') throw new Error("Cannot implicitly convert type 'string' to 'number'");
                    cursorTop = newValue;
                }
            }
        });
        

        // ==== methods ====
        Console.Clear = function() {
            console.clear();
            cursorLeft = 0;
            cursorTop = 0;
        }
        Console.ReadLine = function(title) {

            return new Promise(function(resolve, reject) {
                var ondata = function(e) {
                    /** @type Buffer */
                    var buffer = e;
                    var text = buffer.toString('utf8');
                    process.stdin.removeListener('data', ondata);
                    cursorLeft = 0;
                    cursorTop++;

                    resolve(text);
                }

                title != null && Console.Write(title);

                process.stdin.setRawMode(false);
                process.stdin.addListener('data', ondata);
                process.stdin.resume();
            });
        }
        Console.ReadKey = function() {
            return new Promise(function(resolve) {
                var ondata = function(e) {
                    /** @type Buffer */
                    var buffer = e;
                    var info = {
                        keyCode: 0,
                        keyChar: '',
                        ctrlKey: false, shiftKey: false, altKey: false,
                        buffer: buffer,
                    };


                    var code = buffer.toString('ascii');
                    var bytes = buffer;

                    if (code.length == 1) {
                        var first = bytes[0];

                        if (first == 9) {
                            info.keyCode = first;
                            info.keyChar = String.fromCharCode(first);
                        }
                        else if (1 <= first && first <= 26) {
                            info.keyCode = first + 64;
                            info.keyChar = String.fromCharCode(first + 64);
                            info.ctrlKey = true;
                        }
                        else if (first == 27) {
                            info.keyCode = 27;
                            info.keyChar = String.fromCharCode(27);
                        }
                        else if (first == 28 || first == 29) {
                            info.keyCode = first + 64;
                            info.keyChar = String.fromCharCode(first + 64);
                            info.ctrlKey = true;
                        }
                        else if (32 <= first && first <= 126) {
                            info.keyCode = first;
                            info.keyChar = String.fromCharCode(first);

                        }

                    }



                    process.stdin.setRawMode(false);
                    process.stdin.removeListener('data', ondata);
                    process.stdin.pause();
                    resolve(info);


                }

                process.stdin.setRawMode(true);
                process.stdin.addListener('data', ondata);
                process.stdin.resume();

            });
        }

        Console.Write = function(value) {
            process.stdout.write(value);
            appendText(value);
        }
        Console.WriteLine = function(value) {
            console.log(value);
            appendText(value + require('os').EOL);
        }
        Console.WriteBackgroundColor = function(n) { process.stdout.write('\x1b[48;5;' + n + 'm') }
        Console.WriteForegroundColor = function(n) { process.stdout.write('\x1b[38;5;' + n + 'm') }
        Console.WriteReset = function() { process.stdout.write('\x1b[0m'); }

        Console.bg = function(n) { return '\x1b[48;5;' + n + 'm'; }
        Console.fg = function(n) { return '\x1b[38;5;' + n + 'm'; }
        Console.reset = '\x1b[0m';

        Console.SetCursorPosition = function(left, top) {
            if (left <= 0) left = 0;
            if (top <= 0) top = 0;

            cursorLeft = left; cursorTop = top;

            process.stdout.cursorTo(left, top);
        }

        Console.SelectMenu = function(option) {
            var menu = new Console.Menu();

            menu.x = option.x == null ? 0 : option.x;
            menu.y = option.y == null ? 0 : option.y;

            menu.items.push.apply(menu.items, option.items);

            return menu.select();
        }
        Console.SelectEnum = function(option) {
            var control = new Console.Enum();
            
            control.Items.push.apply(control.Items, option.items);

            return control.Select();
        }
        Console.SelectBoolean = function(title, option) {
            if (title) console.log(title);

            var control = new Console.Enum();
            control.Items.push({ id: 'false', name: 'No' });
            control.Items.push({ id: 'true', name: 'Yes' });

            if (option.paddingLeft) control.PaddingLeft = option.paddingLeft;
            if (option.gap) control.Gap = option.gap;

            return control.Select().then(function(item) {
                if (item.id == 'true')
                    return true;
                else
                    return false;
            });
        }

        // ==== private methods ====
        /** @param {string} text */
        function appendText(text) {
            text = removeAllEscapeSequences(text);

            var width = process.stdout.columns;
            var lines = text.split(require('os').EOL);

            for (var i = 0; i < lines.length; i++) {
                var length = lines[i].length;
                cursorLeft += length;

                while (cursorLeft >= width) {
                    cursorLeft -= width;
                    cursorTop++;
                }

                if (i < lines.length - 1) {
                    cursorLeft = 0; cursorTop++;
                } else {

                }
            }
        }

        /** @returns {string} */
        function removeAllEscapeSequences(text) {
            text = text.replace(new RegExp('\x1b\\[0m', 'g'), '');
            text = removeBetween(text, '\x1b[38;5;', 'm');
            text = removeBetween(text, '\x1b[48;5;', 'm');

            return text;
        }

        

        return Console;
    }()

    
    /**@param {string} text @param {string} startsWith @param {string} endsWith */
    function removeBetween(text, startsWith, endsWith) {
        var startsWithIndex = -1;
        var endsWithIndex = -1;

        do {
            startsWithIndex = text.indexOf(startsWith);

            if (startsWithIndex != -1)
                endsWithIndex = text.indexOf(endsWith, startsWithIndex + startsWith.length);
            else break;

            if (endsWithIndex != -1)
                text = text.substring(0, startsWithIndex) + text.substring(endsWithIndex + endsWith.length);
            else break;

        } while (true);

        return text;
    }


    // intell.Remove    


    return intell;
}();

































