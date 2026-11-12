using System.Net.Http;

namespace AgentGuardApi.Core.Request;

internal interface IRequest
{
    HttpContent Get();

    bool CanRetry { get; }
}
