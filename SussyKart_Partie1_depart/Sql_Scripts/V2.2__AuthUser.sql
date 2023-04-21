CREATE PROCEDURE Utilisateurs.USP_AuthUtilisateur
	@Pseudo nvarchar(50),
	@MotDePasse nvarchar(100)
AS
BEGIN
	DECLARE @Sel varbinary(16);
	DECLARE @MdpHache varbinary(32);
	SELECT @Sel = MdpSel, @MdpHache = MotDePasseHache
	FROM Utilisateurs.Utilisateur
	WHERE Pseudo = @Pseudo;

	IF HASHBYTES('SHA2_256', CONCAT(@MotDePasse, @Sel)) = @MdpHache
	BEGIN
		SELECT * FROM Utilisateurs.Utilisateur WHERE Pseudo = @Pseudo;
	END
	ELSE
	BEGIN
		SELECT TOP 0 * FROM Utilisateurs.Utilisateur;
	END
END
GO