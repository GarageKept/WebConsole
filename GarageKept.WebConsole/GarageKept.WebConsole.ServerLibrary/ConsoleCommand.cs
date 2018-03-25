using System.Collections.Generic;
using GarageKept.WebConsole.ServerLibrary.Interfaces;

namespace GarageKept.WebConsole.ServerLibrary
{
    public abstract class ConsoleCommand: IConsoleCommand
    {
        public List<string> CommandText { get; set; }

        public CommandInfo CommandInfo => throw new System.NotImplementedException();

        public virtual ConsoleResult RunCommand(string command, List<string> tokens)
        {
            return null;
        }
    }
}