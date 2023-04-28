if EXISTS(SELECT * FROM sys.views WHERE name='VW_StatsParticipaiton')
BEGIN
	DROP VIEW VW_StatsParticipation
END
GO

CREATE VIEW VW_StatsParticipation
AS

SELECT [Position],
	[Chrono],
	[NbJoueurs],
	[DateParticipation],
	C.Nom AS 'Nom de la course',
	U.Pseudo AS 'Pseudo du joueur'

	FROM Courses.ParticipationCourse P

	INNER JOIN Utilisateurs.Utilisateur U
	ON P.UtilisateurID = U.UtilisateurID

	INNER JOIN Courses.Course C
	ON P.CourseID = C.CourseID

GO
