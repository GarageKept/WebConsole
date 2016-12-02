using System.Collections.Generic;

namespace GarageKept.WebConsole.ServerLibrary
{
    public interface IServerEntryPoint
    {
        List<string> GetAvailableCommands();
        string ExecuteCommand(string command, string[] tokens);
    }
}