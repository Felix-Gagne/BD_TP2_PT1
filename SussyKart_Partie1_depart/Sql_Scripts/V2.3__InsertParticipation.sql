IF EXISTS(SELECT * FROM sys.procedures WHERE name='USP_InsertParticipation')
BEGIN
	DROP PROCEDURE Utilisateurs.USP_CreerUtilisateur;
END
GO

CREATE PROCEDURE Courses.USP_InsertParticipation
	@Position int,
	@Chrono int,
	@NbJoueur int,
	@NomCourse nvarchar(50), 
	@IdUser int
AS
BEGIN
	DECLARE @IdCourse int;

	SELECT @IdCourse=CourseID FROM Courses.Course
	WHERE @NomCourse=Nom

	INSERT INTO Courses.ParticipationCourse (Position, Chrono, NbJoueurs, DateParticipation, CourseID, UtilisateurID)
	VALUES(@Position, @Chrono, @NbJoueur, GETDATE(), @IdCourse, @IdUser);
END
GO

