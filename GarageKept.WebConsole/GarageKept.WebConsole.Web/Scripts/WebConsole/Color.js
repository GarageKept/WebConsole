class Color {
    constructor() {
        this.isHtml = true;
        this.commandText = "color";
        this.description = "simply changes the color of the .test class";
        this.helpText = "usage: color <css color code>";
    }
    runCommand(parameters) {
        let color = "coral";
        if (parameters.length > 1) {
            color = parameters[1];
        }
        const style = `<style type='text/css' id'console-css'>.test{color: ${color};}</style>`;
        $("head").append(style);
        return `<span style="color:${color};">Setting color to ${color}</span>`;
    }
}
Color.instance = new Color();
//# sourceMappingURL=Color.js.map