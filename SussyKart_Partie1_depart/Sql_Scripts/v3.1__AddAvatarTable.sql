USE TP2_SussyKart
GO

CREATE TABLE Utilisateurs.Avatar(
	ImageID int IDENTITY(1,1),
	UtilisateurID int,
	Identifiant uniqueidentifier NOT NULL ROWGUIDCOL,
	CONSTRAINT PK_Avatar_ImageID PRIMARY KEY (ImageID)
);
GO

ALTER TABLE Utilisateurs.Avatar ADD CONSTRAINT UC_Avatar_Identifiant
UNIQUE (Identifiant);
GO

ALTER TABLE Utilisateurs.Avatar ADD CONSTRAINT DF_Avatar_Identifiant
DEFAULT newid() FOR Identifiant;
GO

ALTER TABLE Utilisateurs.Avatar ADD
FichierImage varbinary(max) FILESTREAM NULL;
GO