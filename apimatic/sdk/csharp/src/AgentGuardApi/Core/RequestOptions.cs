using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using AgentGuardApi.Core.Hooks;
using AgentGuardApi.Core.Models;

namespace AgentGuardApi.Core;

public sealed record RequestOptions
{
    public LogLevel? LogLevel { get; init; }

    public IReadOnlyList<HeaderParam>? Headers { get; init; }

    public IReadOnlyList<SdkHook>? Hooks { get; init; }
}
