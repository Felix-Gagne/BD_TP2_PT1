CREATE VIEW Courses.VW_Profil 
AS

SELECT u.Pseudo, c.Nom, pc.NbJoueurs, pc.Position, pc.Chrono, pc.DateParticipation, u.NoBancaire
from Utilisateurs.Utilisateur u
INNER JOIN Courses.ParticipationCourse pc
ON u.UtilisateurID = pc.UtilisateurID

INNER JOIN Courses.Course c
ON c.CourseID = pc.CourseID
GO


CREATE TABLE Utilisateurs.Profil(
	Profil char(9)
	);
GO

IF EXISTS(SELECT * FROM sys.procedures WHERE name='USP_DecryptNoBancaire')
BEGIN
	DROP PROCEDURE Utilisateurs.USP_DecryptNoBancaire;
END
GO

CREATE PROCEDURE Utilisateurs.USP_DecryptNoBancaire
	@UtilisateurID int

AS
BEGIN
	OPEN SYMMETRIC KEY MaCle
	DECRYPTION BY CERTIFICATE MonCertificat;

	SELECT CONVERT(char(9), DECRYPTBYKEY(NoBancaire)) AS Profil
	FROM Utilisateurs.Utilisateur WHERE UtilisateurID = @UtilisateurID;

	CLOSE SYMMETRIC KEY MaCle
END
GO