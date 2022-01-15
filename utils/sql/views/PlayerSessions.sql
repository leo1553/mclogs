CREATE OR ALTER VIEW [dbo].[PlayerSessions] AS
    SELECT 
        [a].[playerId],
        [a].[login],
        [b].[logout],
        DATEDIFF(second, [a].[login], [b].[logout]) AS [sessionTime]
    FROM
        (SELECT
            ROW_NUMBER() OVER (PARTITION BY [playerId] ORDER BY id) AS [index],
            [time] AS [login],
            [playerId]
        FROM [PlayerJoins])
        AS a
    LEFT JOIN 
        (SELECT
            ROW_NUMBER() OVER (PARTITION BY [playerId] ORDER BY id) AS [index],
            [time] AS [logout],
            [playerId]
        FROM [PlayerLeaves])
        AS b
    ON a.[index] = b.[index] AND a.[playerId] = b.[playerId]
GO
