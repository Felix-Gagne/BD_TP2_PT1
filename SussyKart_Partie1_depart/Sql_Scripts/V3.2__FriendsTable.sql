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

