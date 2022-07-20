
declare namespace Intell {
    interface Namespace {

        IO: Intell.IO.Namespace;

        Diagnostics: Intell.Diagnostics.Namespace;

        Console: Intell.Console.Namespace;

        colors: Colors;
    }

    interface Colors {
        reset: string;
        /** Create foreground color code. */
        fg(n: number): string;

        /** Create background color code. */
        bg(n: number): string;

        /** Remove all styles in text. */
        removeAll(text: string): string;
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

        /** [Very Good]Parse arguments string from string. */
        ParseArguments(arguments: string): ArgumentsInfo;

    }


    interface ArgumentsInfo {
        /** All parameters after split space. The parameters are not parsed by anything. */
        parameters: string[];

        /** Only commands. */
        commands: string[];

        /** Only switches. */
        switches: { [T: string]: string | boolean };
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

        // === properties === //
        /** Gets the column position of the cursor within the buffer area. */
        CursorLeft: number;
        /** Gets the row position of the cursor within the buffer area. */
        CursorTop: number;

        // ==== methods ==== //
        /** Clears the console buffer. */
        Clear(): void;
        ReadLine(): Promise<string>;
        ReadLine(text: string): Promise<string>;
        ReadKey(): Promise<string>;

        Write(value: string): void;
        WriteLine(value: string): void;
        WriteBackgroundColor(value: number): void;
        WriteForegroundColor(value: number): void;
        WriteReset(): void;

        fg(color: number): string;
        bg(color: number): string;
        reset: string;

        SetCursorPosition(left: number, top: number): void;

        SelectMenu(option: { items: MenuItem[], x?: number, y?: number }): Promise<MenuItem>;
        SelectEnum(option: { items: MenuItem[] }): Promise<EnumItem>;
        SelectBoolean(): Promise<boolean>;
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



declare namespace IntellNode {
    interface Console {

    }
    
}

declare module 'intell-node' {
    const intell: Intell.Namespace;


    export = intell;
}

