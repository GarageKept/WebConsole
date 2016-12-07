using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using GarageKept.WebConsole.ServerLibrary;
using GarageKept.WebConsole.ServerLibrary.Interfaces;

namespace GarageKept.WebConsole.Server.Controllers
{
    public class ServerCommandController : ApiController, IServerEntryPoint
    {
        private List<IConsoleCommand> Commands { get; set; } = new List<IConsoleCommand>();

        public ServerCommandController()
        {
        }

        public List<CommandInfo> GetAvailableCommands()
        {
            var availableCommands = new List<CommandInfo>(Commands.Count);

            return availableCommands;
        }

        public ConsoleResult ExecuteCommand(string command, List<string> tokens)
        {
            var cmd = Commands.FirstOrDefault(c => c.CommandText.Contains(command));

            if (cmd == null)
            {
                return new MissingConsoleCommandResult();
            }

            return cmd.RunCommand(command, tokens);
        }
    }
}
