using System.Collections.Generic;

namespace GarageKept.WebConsole.ServerLibrary
{
    public interface IServerEntryPoint
    {
        List<CommandInfo> GetAvailableCommands();
        ConsoleResult ExecuteCommand(string command, List<string> tokens);
    }
}