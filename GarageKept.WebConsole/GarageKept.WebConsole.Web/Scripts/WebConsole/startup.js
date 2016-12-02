$(document).ready(function () {
    var console = new WebConsole(false);


    console.registerCommand(new Echo());
    console.registerCommand(new Color());
});
//# sourceMappingURL=startup.js.map