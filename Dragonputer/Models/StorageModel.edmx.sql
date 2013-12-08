
-- --------------------------------------------------
-- Entity Designer DDL Script for SQL Server 2005, 2008, 2012 and Azure
-- --------------------------------------------------
-- Date Created: 12/08/2013 10:28:31
-- Generated from EDMX file: C:\Users\stuartb\Projects\Dragonputer\Dragonputer\Models\StorageModel.edmx
-- --------------------------------------------------

SET QUOTED_IDENTIFIER OFF;
GO
USE [dragonputer_db];
GO
IF SCHEMA_ID(N'dbo') IS NULL EXECUTE(N'CREATE SCHEMA [dbo]');
GO

-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[FK_CharacterSheetUserProfile]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[CharacterSheets] DROP CONSTRAINT [FK_CharacterSheetUserProfile];
GO

-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[CharacterSheets]', 'U') IS NOT NULL
    DROP TABLE [dbo].[CharacterSheets];
GO
IF OBJECT_ID(N'[dbo].[UserProfiles]', 'U') IS NOT NULL
    DROP TABLE [dbo].[UserProfiles];
GO

-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------

-- Creating table 'CharacterSheets'
CREATE TABLE [dbo].[CharacterSheets] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [UserProfileId] bigint  NOT NULL,
    [Sheet] nvarchar(max)  NOT NULL,
    [Timestamp] datetime  NOT NULL
);
GO

-- Creating table 'UserProfiles'
CREATE TABLE [dbo].[UserProfiles] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [FacebookUserId] bigint  NOT NULL
);
GO

-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------

-- Creating primary key on [Id] in table 'CharacterSheets'
ALTER TABLE [dbo].[CharacterSheets]
ADD CONSTRAINT [PK_CharacterSheets]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'UserProfiles'
ALTER TABLE [dbo].[UserProfiles]
ADD CONSTRAINT [PK_UserProfiles]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------

-- Creating foreign key on [UserProfileId] in table 'CharacterSheets'
ALTER TABLE [dbo].[CharacterSheets]
ADD CONSTRAINT [FK_CharacterSheetUserProfile]
    FOREIGN KEY ([UserProfileId])
    REFERENCES [dbo].[UserProfiles]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Creating non-clustered index for FOREIGN KEY 'FK_CharacterSheetUserProfile'
CREATE INDEX [IX_FK_CharacterSheetUserProfile]
ON [dbo].[CharacterSheets]
    ([UserProfileId]);
GO

-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------