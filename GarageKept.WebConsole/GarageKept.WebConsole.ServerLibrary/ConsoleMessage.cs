namespace GarageKept.WebConsole.ServerLibrary
{
    public class ConsoleMessage
    {
        public bool IsHtml { get; set; }
        public string Message { get; set; }
        public ConsoleResultStatus Status { get; set; }
    }
}