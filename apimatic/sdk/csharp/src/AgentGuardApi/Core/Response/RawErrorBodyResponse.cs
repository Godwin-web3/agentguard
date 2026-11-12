using System.Threading;
using System.Threading.Tasks;
using AgentGuardApi.Core.ErrorResponse;
using AgentGuardApi.Core.Models;

namespace AgentGuardApi.Core.Response;

internal sealed class RawErrorBodyResponse : IResponse<RawError>
{
    public static RawErrorBodyResponse Instance { get; } = new();

    private RawErrorBodyResponse() { }

    public ValueTask<RawError> Map(ResponseContext context, CancellationToken cancellationToken) =>
        new(RawError.Create(context.Response, cancellationToken));
}
