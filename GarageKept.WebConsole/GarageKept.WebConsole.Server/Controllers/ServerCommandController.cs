using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using GarageKept.WebConsole.ServerLibrary;

namespace GarageKept.WebConsole.Server.Controllers
{
    public class ServerCommandController : ApiController, IServerEntryPoint
    {
        private List<ConsoleCommand> Commands { get; set; } = new List<ConsoleCommand>();

        public List<CommandInfo> GetAvailableCommands()
        {
            throw new NotImplementedException();
        }

        public ConsoleResult ExecuteCommand(string command, List<string> tokens)
        {
            var cmd = Commands.FirstOrDefault(c => c.CommandText.Contains(command));

            if (cmd == null)
            {
                return new ConsoleResult();
            }

            return cmd.RunCommand(command, tokens);
        }
    }
}
