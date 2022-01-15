SELECT [dbo].[Players].[name], d.[deaths]
FROM [dbo].[Players]
    INNER JOIN (
        SELECT [playerId], COUNT([playerId]) AS [deaths]
        FROM [dbo].[PlayerDeaths]
        GROUP BY [dbo].[PlayerDeaths].[playerId]
    ) AS d
    ON [dbo].[Players].[id] = d.[playerId]
ORDER BY d.[deaths] DESC
