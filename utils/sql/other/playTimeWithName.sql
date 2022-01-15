SELECT [name], ROUND([playTime] / 3600.0, 1) AS [hours]
FROM [dbo].[PlayerPlayTime]
    LEFT JOIN [dbo].[Players] ON [dbo].[PlayerPlayTime].[playerId] = [dbo].[Players].[id]
ORDER BY [playTime] DESC
