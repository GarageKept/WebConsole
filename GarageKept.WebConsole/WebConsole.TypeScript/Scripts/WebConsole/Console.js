/// <reference path="../typings/jquery/jquery.d.ts" />
var WebConsole = /** @class */ (function () {
    function WebConsole(useCustomCss) {
        if (useCustomCss === void 0) { useCustomCss = false; }
        this.useControl = true;
        this.keyCode = 192;
        this.allowServerCommands = false;
        this.url = "/api/console";
        if (!useCustomCss) {
            $('head').append('<link href="Scripts/webconsole/webcli.css" rel="stylesheet" />');
        }
        this.history = [""]; //Command history
        this.commandOffset = 0; //Reverse offset into history
        this.createElements();
        this.wireEvents();
        this.showGreeting();
        this.busy(false);
    }
    WebConsole.prototype.registerCommand = function (command) {
        WebConsole.localCommands.push(command);
    };
    WebConsole.prototype.createElements = function () {
        var doc = document;
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
    };
    WebConsole.prototype.wireEvents = function () {
        var _this = this;
        this.keyDownHandler = function (e) { _this.onKeyDown(e); };
        this.clickHandler = function (e) { _this.onClick(e); };
        document.addEventListener("keydown", this.keyDownHandler);
        this.ctrlEl.addEventListener("click", this.clickHandler);
    };
    WebConsole.prototype.showGreeting = function () {
        this.writeLine("Command Line Suite [Version 0.0.1]", "system");
        this.newLine();
    };
    WebConsole.prototype.busy = function (status) {
        this.isBusy = status;
        this.busyEl.style.display = status ? "block" : "none";
        this.inputEl.style.display = status ? "none" : "block";
    };
    WebConsole.prototype.onClick = function (e) {
        this.focus();
    };
    WebConsole.prototype.onKeyDown = function (e) {
        var ctrlStyle = this.ctrlEl.style;
        // if use control, we use the ctrl key state, else true to bypass.
        var control = this.useControl ? e.ctrlKey : true;
        //Ctrl + Backquote (Document)
        if (control && e.keyCode === this.keyCode) {
            if (ctrlStyle.display === "none") {
                ctrlStyle.display = "";
                this.focus();
            }
            else {
                ctrlStyle.display = "none";
            }
            return 0;
        }
        if (this.isBusy) {
            return 0;
        }
        //Other keys (when input has focus)
        if (this.inputEl === document.activeElement) {
            switch (e.keyCode) {
                case 13://Enter
                    return this.runCmd();
                case 38://Up
                    if ((this.history.length + this.commandOffset) > 0) {
                        this.commandOffset--;
                        this.inputEl.value = this.history[this.history.length + this.commandOffset];
                        e.preventDefault();
                    }
                    break;
                case 40://Down
                    if (this.commandOffset < -1) {
                        this.commandOffset++;
                        this.inputEl.value = this.history[this.history.length + this.commandOffset];
                        e.preventDefault();
                    }
                    break;
            }
        }
        return 0;
    };
    WebConsole.prototype.focus = function () {
        this.inputEl.focus();
    };
    WebConsole.prototype.runCmd = function () {
        var _this = this;
        var txt = this.inputEl.value.trim();
        if (txt === "") {
            return 0;
        } //If empty, stop processing
        this.commandOffset = 0; //Reset history index
        this.inputEl.value = ""; //Clear input
        this.writeLine(txt, "cmd"); //Write cmd to output
        this.history.push(txt); //Add cmd to history
        // Split the command up
        var tokens = txt.split(" ");
        var cmd = tokens[0].toUpperCase();
        // Non overrideable console commands
        if (cmd === "CLS" || cmd === "CLEAR") {
            this.outputEl.innerHTML = "";
            return 0;
        }
        else if (cmd === "LS") {
            this.writeLine(WebConsole.localCommands.length + " commands loaded");
            for (var _i = 0, _a = WebConsole.localCommands; _i < _a.length; _i++) {
                var command_1 = _a[_i];
                this.writeLine(command_1.commandText.toLowerCase() + ": " + command_1.description, "system");
            }
            return 0;
        }
        else if (cmd === "HELP" || cmd === "?" || cmd === "/?") {
            if (tokens.length === 1) {
                this.writeLine("Use: help <command>", "system");
                this.writeLine("for a list of commands use LS", "system");
            }
            else {
                var found = false;
                for (var _b = 0, _c = WebConsole.localCommands; _b < _c.length; _b++) {
                    var command_2 = _c[_b];
                    if (command_2.commandText.toUpperCase() === cmd) {
                        this.writeLine(command_2.helpText, "system");
                        found = true;
                    }
                }
                if (!found) {
                    this.writeLine("Command not found", "error");
                    this.writeLine("for a list of commands use LS", "system");
                }
            }
            return 0;
        }
        else if (cmd === "EXIT" || cmd === "close") {
            this.ctrlEl.style.display = "none";
            return 0;
        }
        //Client command:
        var command = null;
        for (var _d = 0, _e = WebConsole.localCommands; _d < _e.length; _d++) {
            var localCommand = _e[_d];
            if (localCommand.commandText.toUpperCase() === cmd) {
                command = localCommand;
            }
        }
        if (command != null) {
            var result = command.runCommand(tokens);
            if (command.isHtml) {
                this.writeHtml(result);
            }
            else {
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
                success: function (result) {
                    var output = result.output;
                    var style = result.isError ? "error" : "ok";
                    if (result.isHTML) {
                        _this.writeHtml(output);
                    }
                    else {
                        _this.writeLine(output, style);
                        _this.newLine();
                    }
                },
                error: function () { return _this.writeLine("Error sending request to server", "error"); },
                complete: function () {
                    _this.busy(false);
                }
            });
        }
        else {
            this.writeLine("Command not recognized", "error");
        }
        this.inputEl.blur();
        this.focus();
        return 0;
    };
    WebConsole.prototype.scrollToBottom = function () {
        this.ctrlEl.scrollTop = this.ctrlEl.scrollHeight;
    };
    WebConsole.prototype.newLine = function () {
        this.outputEl.appendChild(document.createElement("br"));
        this.scrollToBottom();
    };
    WebConsole.prototype.writeLine = function (txt, cssSuffix) {
        var span = document.createElement("span");
        cssSuffix = cssSuffix || "ok";
        span.className = "console-" + cssSuffix;
        span.innerText = txt;
        this.outputEl.appendChild(span);
        this.newLine();
    };
    WebConsole.prototype.writeHtml = function (markup) {
        var div = document.createElement("div");
        div.innerHTML = markup;
        this.outputEl.appendChild(div);
        this.newLine();
    };
    // static localCommands: Map<string, IWebConsoleLocalCommand> = new Map < string, IWebConsoleLocalCommand>();
    WebConsole.localCommands = new Array();
    return WebConsole;
}());
//# sourceMappingURL=Console.js.map