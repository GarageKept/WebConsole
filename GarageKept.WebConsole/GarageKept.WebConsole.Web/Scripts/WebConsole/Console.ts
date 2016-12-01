/// <reference path="../typings/jquery/jquery.d.ts" />


    class WebConsole {
        static localCommands: Map<string, IWebConsoleLocalCommand> = new Map < string, IWebConsoleLocalCommand>();

        history: [string];
        commandOffset: number;
        isBusy: boolean;

        inputEl: HTMLInputElement;
        outputEl: HTMLDivElement;
        ctrlEl: HTMLDivElement;
        busyEl: HTMLDivElement;

        keyDownHandler: (e: any) => void;
        clickHandler: (e: any) => void;

        useControl: boolean = true;
        keyCode: Number = 192;
        allowServerCommands: boolean = false;
        url = "/api/console";
        
        registerCommand(command: IWebConsoleLocalCommand) {
            WebConsole.localCommands.set(command.commandText.toUpperCase(), command);
        }

        constructor(useCustomCss: boolean = false) {
            if (!useCustomCss) {
                $('head').append('<link href="Scripts/CommandLine/webcli.css" rel="stylesheet" />');
            }

            this.history = [""]; //Command history
            this.commandOffset = 0; //Reverse offset into history

            this.createElements();
            this.wireEvents();
            this.showGreeting();
            this.busy(false);
        }

        createElements() {
            const doc = document;

            //Create & store CLI elements
            this.outputEl = doc.createElement("div"); //Div holding console output
            this.inputEl = doc.createElement("input"); //Input control
            this.ctrlEl = doc.createElement("div"); //CLI control (outer frame)
            this.busyEl = doc.createElement("div"); //Busy animation

            //Add classes
            this.ctrlEl.className = "console";
            this.outputEl.className = "console-output";
            this.inputEl.className = "console-input";
            this.busyEl.className = "console-busy";

            //Add attribute
            this.inputEl.setAttribute("spellcheck", "false");

            //Assemble them
            this.ctrlEl.appendChild(this.outputEl);
            this.ctrlEl.appendChild(this.inputEl);
            this.ctrlEl.appendChild(this.busyEl);

            //Hide ctrl & add to DOM
            this.ctrlEl.style.display = "none";
            doc.body.appendChild(this.ctrlEl);
        }

        wireEvents() {
            this.keyDownHandler = e => { this.onKeyDown(e); };
            this.clickHandler = e => { this.onClick(e); };

            document.addEventListener("keydown", this.keyDownHandler);
            this.ctrlEl.addEventListener("click", this.clickHandler);
        }

        showGreeting() {
            this.writeLine("Command Line Suite [Version 0.0.1]", "system");
            this.newLine();
        }

        busy(status: boolean) {
            this.isBusy = status;
            this.busyEl.style.display = status ? "block" : "none";
            this.inputEl.style.display = status ? "none" : "block";
        }

        onClick(e: any) {
            this.focus();
        }

        onKeyDown(e) {
            const ctrlStyle = this.ctrlEl.style;

            // if use control, we use the ctrl key state, else true to bypass.
            let control = this.useControl ? e.ctrlKey: true;

            //Ctrl + Backquote (Document)
            if (control && e.keyCode === this.keyCode) {
                if (ctrlStyle.display === "none") {
                    ctrlStyle.display = "";
                    this.focus();
                } else {
                    ctrlStyle.display = "none";
                }
                return 0;
            }

            if (this.isBusy) {
                return 0;
            }

            //Other keys (when input has focus)
            if (this.inputEl === document.activeElement) {
                switch (e.keyCode) //http://keycode.info/
                {
                case 13: //Enter
                    return this.runCmd();

                case 38: //Up
                    if ((this.history.length + this.commandOffset) > 0) {
                        this.commandOffset--;
                        this.inputEl.value = this.history[this.history.length + this.commandOffset];
                        e.preventDefault();
                    }
                    break;

                case 40: //Down
                    if (this.commandOffset < -1) {
                        this.commandOffset++;
                        this.inputEl.value = this.history[this.history.length + this.commandOffset];
                        e.preventDefault();
                    }
                    break;
                }
            }
            return 0;
        }

        focus() {
            this.inputEl.focus();
        }

        runCmd(): number {
            const txt = this.inputEl.value.trim();

            if (txt === "") {
                return 0;
            } //If empty, stop processing

            this.commandOffset = 0; //Reset history index
            this.inputEl.value = ""; //Clear input
            this.writeLine(txt, "cmd"); //Write cmd to output
            this.history.push(txt); //Add cmd to history

            // Split the command up
            const tokens = txt.split(" ");
            const cmd = tokens[0].toUpperCase();

            // Non overrideable console commands
            if (cmd === "CLS") {
                this.outputEl.innerHTML = "";
                return 0;
            } else if (cmd === "LS") {
                for (var key of WebConsole.localCommands.keys()) {
                    this.writeLine(key + ": " + WebConsole.localCommands.get(key).description, "system");
                }
                return 0;
            } else if (cmd === "HELP" || cmd === "?" || cmd === "/?") {
                if (tokens.length === 1) {
                    this.writeLine("Use: help <command>", "system");
                    this.writeLine("for a list of commands use LS", "system");
                } else {
                    if (WebConsole.localCommands.has(tokens[1].toUpperCase())) {
                        this.writeLine(WebConsole.localCommands.get(tokens[1].toUpperCase()).helpText, "system");
                    } else {
                        this.writeLine("Command not found", "error");
                        this.writeLine("for a list of commands use LS", "system");
                    }
                }

                return 0;
            } else if (cmd === "EXIT" || cmd === "close") {
                this.ctrlEl.style.display = "none";

                return 0;
            }


            //Client command:
            let command = WebConsole.localCommands.get(cmd);
            if (command != null) {
                let result = command.runCommand(tokens);
                if (command.isHtml) {
                    this.writeHtml(result);
                } else {
                    this.writeLine(result);
                }
                return 0;
            }

            if (this.allowServerCommands) {
                //Server command:
                this.busy(true);
                $.ajax({
                    url: this.url,
                    type: "POST",
                    headers: { "Content-Type": "application/json" },
                    data: JSON.stringify({ cmdLine: txt }),
                    success: result => {
                        const output = result.output;
                        const style = result.isError ? "error" : "ok";

                        if (result.isHTML) {
                            this.writeHtml(output);
                        } else {
                            this.writeLine(output, style);
                            this.newLine();
                        }
                    },
                    error: () => this.writeLine("Error sending request to server", "error"),
                    complete: () => {
                        this.busy(false);
                    }
                });
            } else {
                this.writeLine("Command not recognized", "error");
            }

            this.inputEl.blur();
            this.focus();
            return 0;
        }

        scrollToBottom() {
            this.ctrlEl.scrollTop = this.ctrlEl.scrollHeight;
        }

        newLine() {
            this.outputEl.appendChild(document.createElement("br"));
            this.scrollToBottom();
        }

        writeLine(txt: string, cssSuffix?: string) {
            const span = document.createElement("span");
            cssSuffix = cssSuffix || "ok";
            span.className = `console-${cssSuffix}`;
            span.innerText = txt;
            this.outputEl.appendChild(span);
            this.newLine();
        }

        writeHtml(markup) {
            const div = document.createElement("div");
            div.innerHTML = markup;
            this.outputEl.appendChild(div);
            this.newLine();
        }
    }

    interface IWebConsoleLocalCommand {
        isHtml:boolean;
        commandText: string;
        description: string;
        helpText: string;
        runCommand(parameters: string[]): string;
    }
                                        