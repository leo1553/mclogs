CREATE OR ALTER VIEW [dbo].[PlayerPlayTime] AS
    SELECT
        [playerId],
        SUM([sessionTime]) AS [playTime]
    FROM
        [dbo].[PlayerSessions] AS a
    GROUP BY [playerId]
GO
