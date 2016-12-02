var Echo = (function () {
    function Echo() {
        this.isHtml = false;
        this.commandText = "echo";
        this.description = "Will echo any text entered";
        this.helpText = "usage: echo <text>";
    }
    Echo.prototype.runCommand = function (parameters) {
        var result = "";
        var count = 0;
        for (var i = 0; i < parameters.length; i++) {
            if (count !== 0) {
                result += parameters[i] + " ";
            }
            count++;
        }
        return "Echo: " + result;
    };
    Echo.instance = new Echo();
    return Echo;
}());
//# sourceMappingURL=Echo.js.map