-- •○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•
--				Création des tables
-- •○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•

USE TP2_SussyKart;
GO

CREATE TABLE Courses.Course(
	CourseID int IDENTITY(1,1),
	Nom varchar(50) NOT NULL,
	NbTours int NOT NULL,
	Difficulte varchar(15) NOT NULL,
	CONSTRAINT PK_Course_CourseID PRIMARY KEY (CourseID)
);

CREATE TABLE Utilisateurs.Utilisateur(
	UtilisateurID int IDENTITY(1,1),
	Pseudo nvarchar(30) NOT NULL,
	DateInscription datetime NOT NULL,
	Courriel nvarchar(320) NOT NULL,
	EstSuppr bit NOT NULL,
	CONSTRAINT PK_Utilisateur_UtilisateurID PRIMARY KEY (UtilisateurID)
);

CREATE TABLE Courses.ParticipationCourse(
	ParticipationCourseID int IDENTITY(1,1),
	Position int NOT NULL,
	Chrono int NOT NULL,
	NbJoueurs int NOT NULL,
	DateParticipation datetime NOT NULL,
	CourseID int NOT NULL,
	UtilisateurID int NOT NULL,
	CONSTRAINT PK_ParticipationCourse_ParticipationCourseID PRIMARY KEY (ParticipationCourseID)
);
GO

-- •○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•
--			  Création des contraintes
-- •○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•

USE TP2_SussyKart;
GO

ALTER TABLE Courses.ParticipationCourse ADD CONSTRAINT FK_ParticipationCourse_CourseID
FOREIGN KEY (CourseID) REFERENCES Courses.Course(CourseID)
ON DELETE CASCADE
ON UPDATE CASCADE;
GO

ALTER TABLE Courses.ParticipationCourse ADD CONSTRAINT FK_ParticipationCourse_UtilisateurID
FOREIGN KEY (UtilisateurID) REFERENCES Utilisateurs.Utilisateur(UtilisateurID);
GO

-- Noms de courses uniques
ALTER TABLE Courses.Course ADD CONSTRAINT UC_Course_Nom
UNIQUE (Nom);
GO

-- 1 à 10 tours pour une course
ALTER TABLE Courses.Course ADD CONSTRAINT CK_Course_NbTours
CHECK (NbTours BETWEEN 1 AND 10);
GO

-- Difficulté facile, normale ou difficile
ALTER TABLE Courses.Course ADD CONSTRAINT CK_Course_Difficulte
CHECK (Difficulte IN ('facile', 'normale', 'difficile'));
GO

-- Pseudos uniques
ALTER TABLE Utilisateurs.Utilisateur ADD CONSTRAINT UC_Utilisateur_Pseudo
UNIQUE (Pseudo);
GO

-- Courriel valide
ALTER TABLE Utilisateurs.Utilisateur ADD CONSTRAINT CK_Utilisateur_Courriel
CHECK (Courriel LIKE '_%@_%.__%');
GO

-- EstSuppr à 0 par défaut
ALTER TABLE Utilisateurs.Utilisateur ADD CONSTRAINT DF_Utilisateur_EstSuppr
DEFAULT 0 FOR EstSuppr;
GO

-- Position entre 1 et 4
ALTER TABLE Courses.ParticipationCourse ADD CONSTRAINT CK_ParticipationCourse_Position
CHECK (Position BETWEEN 1 AND 4);
GO

-- NbJoueurs entre 1 et 4
ALTER TABLE Courses.ParticipationCourse ADD CONSTRAINT CK_ParticipationCourse_NbJoueurs
CHECK (NbJoueurs BETWEEN 1 AND 4);
GO

-- Chrono positif
ALTER TABLE Courses.ParticipationCourse ADD CONSTRAINT CK_ParticipationCourse_Chrono
CHECK (Chrono >= 0);
GO

-- •○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•
--			  Création des déclencheurs
-- •○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•

USE TP2_SussyKart;
GO

CREATE TRIGGER Utilisateurs.TRd_Utilisateur_Utilisateur
ON Utilisateurs.Utilisateur INSTEAD OF DELETE
AS
BEGIN
	SET NOCOUNT ON;
	
	UPDATE Utilisateurs.Utilisateur
	SET EstSuppr = 1
	WHERE UtilisateurID IN (SELECT UtilisateurID FROM deleted);
END
GO

-- •○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•
--			  Création des procédures
-- •○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•

USE TP2_SussyKart;
GO

CREATE PROCEDURE Utilisateurs.USP_CreerUtilisateur
	@Pseudo nvarchar(30),
	@Courriel nvarchar(320)
AS
BEGIN
	SET NOCOUNT ON;
	
	INSERT INTO Utilisateurs.Utilisateur (Pseudo, DateInscription, Courriel, EstSuppr)
	VALUES (@Pseudo, GETDATE(), @Courriel, 0);
END
GO






