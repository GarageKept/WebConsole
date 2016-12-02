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
        public List<string> GetAvailableCommands()
        {
            throw new NotImplementedException();
        }

        public string ExecuteCommand(string command, string[] tokens)
        {
            throw new NotImplementedException();
        }
    }
}
