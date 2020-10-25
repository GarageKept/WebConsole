class Color implements IWebConsoleLocalCommand {
    static instance = new Color();

    isHtml = true;
    commandText = "color";
    description = "simply changes the color of the .console-system class";
    helpText = "usage: color <css color code>";
    
    runCommand(parameters: string[]): string {
        let color = "coral";

        if (parameters.length > 1) {
            color = parameters[1];
        }

        const style = `<style type='text/css' id'console-css'>.console-system{color: ${color};}</style>`;
        $("head").append(style);

        return `<span style="color:${color};">Setting color to ${color}</span>`;
    }
}