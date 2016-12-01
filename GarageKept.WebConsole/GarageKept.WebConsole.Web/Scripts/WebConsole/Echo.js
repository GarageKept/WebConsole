class Echo {
    constructor() {
        this.isHtml = false;
        this.commandText = "echo";
        this.description = "Will echo any text entered";
        this.helpText = "usage: echo <text>";
    }
    runCommand(parameters) {
        let result = "";
        let count = 0;
        for (let i = 0; i < parameters.length; i++) {
            if (count !== 0) {
                result += parameters[i] + " ";
            }
            count++;
        }
        return `Echo: ${result}`;
    }
}
Echo.instance = new Echo();
//# sourceMappingURL=Echo.js.map