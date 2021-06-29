declare namespace Intell {
    interface Namespace {

        IO: Intell.IO.Namespace;

        Diagnostics: Intell.Diagnostics.Namespace;

        Console: Intell.Console.Namespace;

        createArgumentsObject(): { [T: string]: string };

        colors: Colors;
    }

    interface Colors {
        reset: string;
        /** Create foreground color code.*/
        fg(n: number): string;

        /** Create background color code.*/
        bg(n: number): string;
    }
}


declare namespace Intell.IO {
    interface Namespace {
        Directory: Directory;
        File: File;
        Path: Path;
    }

    interface Directory {
        CreateDirectory(path: string): void;
        GetParent(Path: string): string;
        GetDirectories(path: string, allDirectories: boolean): string[];
        GetFiles(path: string, allDirectories: boolean): string[];
        CopyDirectory(sourceDirectoryName: string, destinationDirectoryName: string): void;
        Exists(path: string): boolean;
        Delete(path: string, recursive: boolean): boolean;
    }
    interface File {
        /** Copies an existing file to a new file.Overwriting a file of the same name is allowed. */
        Copy(sourceFileName: string, destFileName: string, overwrite: boolean): void;
        ReadAllText(path: string): string;
        WriteAllText(path: string, contents: string, encoding: BufferEncoding): string;
        Exists(path: string): boolean;
        Delete(path: string): boolean;
    }
    interface Path {
        /** "C:\aaaa\bbb.txt" => "bbb.txt" */
        GetFileName(path: string): string;

        /** "C:\aaaa\bbb.txt" => "bbb" */
        GetFileNameWithoutExtension(path: string): string;

        /** "C:\aaaa\bbb.txt" => ".txt" */
        GetExtension(path: string): string;

        GetDirectoryName(path: string): string;

        GetFullPath(path: string): string;

        Combine(...paths: string[]): string;
    }
}


declare namespace Intell.Diagnostics {
    interface Namespace {
        CreateArguments(argument: string): Arguments;
    }

    interface Arguments {
        action: string;
        actions: string[];

        options: {
            [T: string]: boolean | string;
        }

    }
}


declare namespace Intell.Console {
    interface Namespace {
        Menu: {
            new(): Menu;
        };
        Enum: {
            new(): Enum;
        }

        ReadLine(): Promise<string>;
        ReadLine(text: string): Promise<string>;


        SelectMenu(option: { items: MenuItem[], x: number, y: number }): Promise<MenuItem>;
        SelectEnum(option: { items: MenuItem[] }): Promise<EnumItem>;
        //SelectBoolean(): Promise<boolean>;
        SelectBoolean(title: string, option: { paddingLeft: number, gap: number }): Promise<boolean>;
    }


    interface Menu {
        // property 
        items: MenuItem[];
        x: number;
        y: number;
        padding: number;


        // methods
        draw(): void;
        select(): Promise<MenuItem>;
    }
    interface MenuItem {
        id: string;
        name: string;
        description: string;
    }
    interface Enum {
        // properties
        Items: EnumItem[];
        PaddingLeft: number;
        Gap: number;

        // methods
        Select(): Promise<EnumItem>;
        Draw(): void;
    }
    interface EnumItem {
        id: string;
        name: string;
    }
}

declare module 'intell-node' {

  
    const intell: Intell.Namespace;
    export = intell;
}

