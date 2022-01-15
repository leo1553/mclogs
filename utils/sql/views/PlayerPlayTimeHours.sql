CREATE OR ALTER VIEW [dbo].[PlayerPlayTimeHours] AS
    SELECT
        [playerId],
        ([playTime] / 3600.0) AS [hoursPlayed]
    FROM
        [dbo].[PlayerPlayTime] AS a
GO
