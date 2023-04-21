IF EXISTS(SELECT * FROM sys.procedures WHERE name='USP_CreerUtilisateur')
BEGIN
	DROP PROCEDURE Utilisateurs.USP_CreerUtilisateur;
END
GO

CREATE PROCEDURE Utilisateurs.USP_CreerUtilisateur
	@Pseudo nvarchar(50),
	@MotDePasse nvarchar(100),
	@NoBancaire char(9),
	@Email nvarchar(256)
AS
BEGIN
	--Sels aléatoires
	DECLARE @MdpSel varbinary(16) = CRYPT_GEN_RANDOM(16);

	--Concaténation de données et sel
	DECLARE @MdpEtSel nvarchar(116) = CONCAT(@MotDePasse, @MdpSel);

	--Hachage du mot de passe
	DECLARE @MdpHachage varbinary(32) = HASHBYTES('SHA2_256', @MdpEtSel);

	--Chiffrement du NoBancaire
	OPEN SYMMETRIC KEY MaCle
	DECRYPTION BY CERTIFICATE MonCertificat;

	DECLARE @NoBancaireChiffre varbinary(max) = EncryptByKey(KEY_GUID('MaCle'), @NoBancaire);

	CLOSE SYMMETRIC KEY MaCle;

	--Insertion
	INSERT INTO Utilisateurs.Utilisateur (Pseudo, DateInscription, Courriel, EstSuppr, MotDePasseHache, MdpSel, NoBancaire)
	Values
	(@Pseudo, GETDATE(), @Email, 0, @MdpHachage, @MdpSel, @NoBancaireChiffre);

END
GO