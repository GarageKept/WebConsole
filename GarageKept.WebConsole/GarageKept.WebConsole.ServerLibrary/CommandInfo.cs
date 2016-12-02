using System.Collections.Generic;

namespace GarageKept.WebConsole.ServerLibrary
{
    public struct CommandInfo
    {
        public List<string> CommandText { get; set; }
        public string Description { get; set; }
    }
}