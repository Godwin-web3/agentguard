using System.Threading;
using System.Threading.Tasks;
using AgentGuardApi.Core.Models;

namespace AgentGuardApi.Core.ErrorResponse;

internal interface IErrorResponse<TError>
{
    Task<TError> Map(ResponseContext context, CancellationToken cancellationToken);
}
