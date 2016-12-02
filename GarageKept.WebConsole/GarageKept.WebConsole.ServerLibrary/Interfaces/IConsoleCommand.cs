using System.Collections.Generic;

namespace GarageKept.WebConsole.ServerLibrary.Interfaces
{
    public interface IConsoleCommand
    {
        ConsoleResult RunCommand(string command, List<string> tokens);
    }
}