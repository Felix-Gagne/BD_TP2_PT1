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
