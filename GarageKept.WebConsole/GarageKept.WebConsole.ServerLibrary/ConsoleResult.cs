using System.Collections.Generic;
using System.Linq;

namespace GarageKept.WebConsole.ServerLibrary
{
    public class ConsoleResult
    {
        public bool HasErrors
        {
            get { return Messages.Any(m => m.Status == ConsoleResultStatus.Error); }
        }

        public List<ConsoleMessage> Messages { get; set; } = new List<ConsoleMessage>();
    }
}