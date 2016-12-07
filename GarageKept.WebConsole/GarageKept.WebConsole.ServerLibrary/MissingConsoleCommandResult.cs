namespace GarageKept.WebConsole.ServerLibrary
{
    public class MissingConsoleCommandResult : ConsoleResult
    {
        public MissingConsoleCommandResult()
        {
            Messages.Add(new ConsoleMessage("Command not found", ConsoleResultStatus.Error, false));
        }
    }
}