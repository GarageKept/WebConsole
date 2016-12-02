$(document).ready(() => {
    var console = new WebConsole(false);

    console.registerCommand(new Echo());
    console.registerCommand(new Color());
});