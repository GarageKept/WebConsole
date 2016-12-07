namespace GarageKept.WebConsole.ServerLibrary
{
    public class ConsoleMessage
    {
        public ConsoleMessage(string message, ConsoleResultStatus status, bool isHtml)
        {
            Message = message;
            Status = status;
            IsHtml = isHtml;
        }

        public bool IsHtml { get; set; }
        public string Message { get; set; }
        public ConsoleResultStatus Status { get; set; }
    }
}