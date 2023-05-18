-- •○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•
--				Création de la BD
-- •○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•○•

USE MASTER;
GO

IF EXISTS(SELECT * FROM sys.databases WHERE name='TP2_SussyKart')
BEGIN
    DROP DATABASE TP2_SussyKart
END
CREATE DATABASE TP2_SussyKart

EXEC sp_configure filestream_access_level, 2 RECONFIGURE

ALTER DATABASE TP2_SussyKart
ADD FILEGROUP FG_Images CONTAINS FILESTREAM;
GO
ALTER DATABASE TP2_SussyKart
ADD FILE (
	NAME = FG_Images,
	FILENAME = 'C:\EspaceLabo\FG_Images'
)
TO FILEGROUP FG_Images
GO
