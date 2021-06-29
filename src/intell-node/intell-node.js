module.exports = function() {
    /** @type Intell.Namespace */
    var intell = {};

    const FS = require('fs');
    const Path = require('path');

    intell.createArgumentsObject = function() {
        var o = {};

        for (var i = 0; i < global.process.argv.length; i++) {
            var argument1 = global.process.argv[i];
            var argument2 = global.process.argv[i + 1];

            if (argument1.startsWith('-') == true) {
                var name = argument1.replace(/^-+/g, '');

                if (argument2 == undefined || argument2.startsWith('-') == true)
                    o[name] = true;
                else
                    o[name] = argument2;
            }

            
        }

        return o;
    }


    

    intell.colors = new function() {
        this.reset = '\x1b[0m';
        this.fg = function(number) {
            return '\x1b[38;5;' + number + 'm';
        };
        this.bg = function(number) {
            return '\x1b[48;5;' + number + 'm';
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
        var diagnostics = this;


        // methods
        diagnostics.CreateArguments = function(argument) {
            /** @type Intell.Diagnostics.Arguments */
            var o = {
                actions: [],
                options: [],
            };

            var arguments;

            if (argument == null) arguments = global.process.argv.slice(2);
            else arguments = argument.split(' ');
            
            for (var i = 0; i < arguments.length; i++) {
                var argument1 = arguments[i];
                var argument2 = arguments[i + 1];

                //build -development -target map12v12

                if (argument1.startsWith('-') == false) {
                    o.action = argument1;
                    o.actions.push(argument1);

                } else if (argument1.startsWith('-') == true) {
                    var name = argument1.replace(/^-+/g, '');

                    
                    if (argument2 == undefined || argument2.startsWith('-') == true)
                        o.options[name] = true;
                    else {
                        o.options[name] = argument2;
                        i++;
                    }
                }


            }

            return o;

        }
        //var intell.Diagnostics
    }();

    intell.Console = new function() {
        /** @type Intell.Console.Namespace */
        var ns = this;

        ns.Menu = function() {

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
                        line = line + intell.colors.bg(2) + _this.items[i].name + intell.colors.reset;
                    else
                        line = line + _this.items[i].name;

                    console.log(line);

                }

                process.stdout.moveCursor(0, 1);

                var item = _this.items[index];
                process.stdout.clearScreenDown();
                if (item.description)
                    console.log(item.description);

            }
            _this.select = function() {

                return new Promise(function(resolve, reject) {
                    if (_this.x == null) _this.x = 0;
                    if (_this.y == null) _this.y = 0;

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
                            resolve(item);
                            return;
                        }

                        if (index < 0) { index = 0; return }
                        if (index >= _this.items.length) { index = _this.items.length - 1; return }


                        process.stdout.cursorTo(_this.x, _this.y);
                        _this.draw();
                    }

                    index = 0;
                    process.stdin.setRawMode(true);
                    process.stdin.addListener('data', ondata);


                    process.stdout.cursorTo(_this.x, _this.y);
                    _this.draw();


                });


            }
        }

        ns.Enum = function() {

            /** @type Intell.Console.Enum */
            var _this = this;

            // fields
            var index = 0;

            // property
            /** @type Intell.Console.EnumItem[] */
            var items = [];
            var paddingLeft = 0;
            var gap = 0;

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
                process.stdout.write(' '.repeat(paddingLeft));

                for (var i = 0; i < items.length; i++) {
                    var item = items[i]
                    var name = '  ' + item.name + '  ';

                    if (index == i) process.stdout.write(intell.colors.bg(2) + name + intell.colors.reset);
                    else process.stdout.write(name);

                    if (i != items.length - 1)
                        process.stdout.write(' '.repeat(gap));
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
                            process.stdin.removeListener('data', ondata);

                            resolve(items[index]);
                            return;
                        }

                        process.stdout.cursorTo(0);
                        _this.Draw();
                    }

                    index = 0;
                    process.stdin.setRawMode(true);
                    process.stdin.addListener('data', ondata);

                    process.stdout.cursorTo(0);
                    _this.Draw();
                });
            }
        }
        
        // methods
        ns.ReadLine = function(title) {
            var readline = require('readline');

            return new Promise(function(resolve, reject) {
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });
                rl.question(title == null ? '' : title, function(answer) {
                    resolve(answer);
                    rl.close();
                });
                //process.stdin.on('')
                //rl.on()
            });
        }
        ns.SelectMenu = function(option) {
            var menu = new ns.Menu();

            menu.x = option.x == null ? 0 : option.x;
            menu.y = option.y == null ? 0 : option.y;

            menu.items.push.apply(menu.items, option.items);

            return menu.select();
        }
        ns.SelectEnum = function(option) {
            var control = new ns.Enum();
            control.Items.push.apply(control.Items, option.items);

            return control.Select();
        }
        ns.SelectBoolean = function(title, option) {
            if (title) console.log(title);

            var control = new ns.Enum();
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
    }()

    // nIntell

    return intell;
}();
































