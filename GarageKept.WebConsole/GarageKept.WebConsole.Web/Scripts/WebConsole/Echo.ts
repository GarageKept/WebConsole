class Echo implements IWebConsoleLocalCommand {
    static instance = new Echo();
    isHtml = false;
    commandText = "echo";
    description="echos any text entered";
    helpText = "usage: echo <text>";
    
    runCommand(parameters: string[]): string {

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