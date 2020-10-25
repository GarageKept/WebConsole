var Color = (function () {
    function Color() {
        this.isHtml = true;
        this.commandText = "color";
        this.description = "simply changes the color of the .console-system class";
        this.helpText = "usage: color <css color code>";
    }
    Color.prototype.runCommand = function (parameters) {
        var color = "coral";
        if (parameters.length > 1) {
            color = parameters[1];
        }
        var style = "<style type='text/css' id'console-css'>.console-system{color: " + color + ";}</style>";
        $("head").append(style);
        return "<span style=\"color:" + color + ";\">Setting color to " + color + "</span>";
    };
    Color.instance = new Color();
    return Color;
}());
//# sourceMappingURL=Color.js.map