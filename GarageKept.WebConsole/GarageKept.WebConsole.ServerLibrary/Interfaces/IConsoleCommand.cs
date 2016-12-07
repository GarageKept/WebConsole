using System.Collections.Generic;

namespace GarageKept.WebConsole.ServerLibrary.Interfaces
{
    public interface IConsoleCommand
    {
        List<string> CommandText { get; }
        CommandInfo CommandInfo { get; }

        ConsoleResult RunCommand(string command, List<string> tokens);
    }
}