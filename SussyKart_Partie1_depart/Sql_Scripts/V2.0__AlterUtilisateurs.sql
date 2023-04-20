ALTER TABLE Utilisateurs.Utilisateur
ADD MotDePasseHache varbinary(32),
MdpSel varbinary(16),
NoBancaire varbinary(max);
GO


--MOT DE PASSE




UPDATE Utilisateurs.Utilisateur
SET  MdpSel = CRYPT_GEN_RANDOM(16); 
GO 

UPDATE Utilisateurs.Utilisateur
SET MotDePasseHache = HASHBYTES('SHA2_256', CONCAT(N'patate', MdpSel)); 
GO

CREATE MASTER KEY ENCRYPTION BY PASSWORD = 'P4ssw0rd1234!1234';
GO

CREATE CERTIFICATE MonCertificat WITH SUBJECT = 'Chiffrement NoBancaire';
Go

CREATE SYMMETRIC KEY MaCle WITH ALGORITHM = AES_256 ENCRYPTION BY CERTIFICATE MonCertificat;

OPEN SYMMETRIC KEY Macle
	DECRYPTION BY CERTIFICATE MonCertificat;

	UPDATE Utilisateurs.Utilisateur
	SET NoBancaire = EncryptByKey(KEY_GUID('MaCle'), '123456789');
	
CLOSE SYMMETRIC KEY MaCle;
GO