USE TP2_SussyKart
GO

CREATE TABLE Utilisateurs.Amitie(
	AmitieID int,
	UtilisateurID int,
	UtilisateurID_Ami int
	CONSTRAINT PK_Amitie_AmitieID PRIMARY KEY (AmitieID)
);

ALTER TABLE Utilisateurs.Amitie ADD CONSTRAINT FK_Amitie_UtilisateurID
FOREIGN KEY (UtilisateurID) references Utilisateurs.Utilisateur(UtilisateurID)

ALTER TABLE Utilisateurs.Amitie ADD CONSTRAINT FK_Amitie_UtilisateurID_Ami
FOREIGN KEY (UtilisateurID_Ami) references Utilisateurs.Utilisateur(UtilisateurID)

ALTER TABLE Utilisateurs.Amitie ADD CONSTRAINT UQ_Amitie_UtilisateurID_UtilisateurID_Ami
UNIQUE(UtilisateurID, UtilisateurID_Ami)
GO

CREATE TRIGGER dtrg_delUser
on Utilisateurs.Utilisateur
INSTEAD of DELETE
as
BEGIN
	DELETE FROM Utilisateurs.Amitie WHERE UtilisateurID = any (SELECT UtilisateurID FROM deleted);
	DELETE FROM Utilisateurs.Avatar WHERE UtilisateurID = any (SELECT UtilisateurID FROM deleted);

	SET NOCOUNT ON;
	UPDATE Utilisateurs.Utilisateur
	SET EstSuppr = 1
	WHERE UtilisateurID IN (SELECT UtilisateurID FROM deleted);
END
GO

CREATE OR ALTER PROCEDURE Utilisateurs.USP_AuthUtilisateur
	@Pseudo nvarchar(50),
	@Mdp nvarchar(50)
AS
BEGIN

	DECLARE @Sel varbinary(16);

	DECLARE @MdpHache varbinary(32);

	DECLARE @isDeleted int;

	SELECT @Sel = MdpSel, @MdpHache = MotDePasseHache, @isDeleted = EstSuppr
	FROM Utilisateurs.Utilisateur
	WHERE Pseudo = @Pseudo;

	IF HASHBYTES('SHA2_256', CONCAT(@Mdp, @Sel)) = @MdpHache and @isDeleted != 1
	BEGIN
		SELECT * FROM Utilisateurs.Utilisateur WHERE Pseudo = @Pseudo;
	END
	ELSE
	BEGIN
		SELECT TOP 0 * FROM Utilisateurs.Utilisateur;
	END
END
GO