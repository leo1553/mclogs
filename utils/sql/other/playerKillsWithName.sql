SELECT k.[name] AS killer, v.[name] AS victim, [message]
FROM [dbo].[PlayerKills]   
    INNER JOIN [dbo].[PlayerDeaths]
    ON [dbo].[PlayerKills].[playerDeathId] = [dbo].[PlayerDeaths].[id]
    INNER JOIN [dbo].[Players] AS v
    ON [dbo].[PlayerKills].[killedId] = v.[id]
    INNER JOIN [dbo].[Players] AS k
    ON [dbo].[PlayerKills].[killerId] = k.[id]
