--Display/Read Queries
SELECT * FROM Trainer
SELECT * FROM Pokemon
SELECT * FROM Storage
SELECT * FROM Region

--Create Queries--
--Create Trainer
INSERT INTO Trainer (name_id, gender, age, region)
VALUES (:name_idInput, genderInput, ageInput, regionInput)

--Create Pokemon
INSERT INTO Pokemon (pokemon_name, health, attack, defence, special_atk, special_def, speed, type_1, type_2, ability_1, ability_2, hidden_ability)
VALUES (:pokemon_nameInput, :healthInput, :attackInput, :defenceInput, :special_atkInput, :special_defInput, :speedInput, :type_1Input, :type_2Input, :ability_1Input, :ability_2Input, :hidden_abilityInput)

--Create Storage
INSERT INTO Storage (pid, pokeid)
VALUES (:pidInput, :pokeidInput)

--Create Region
INSERT INTO Region (region_name)
VALUES (:region_nameInput)

--Update Queries--
--Update Trainer's gender given Trainer's name
UPDATE Trainer SET gender = :genderInput WHERE name_id = :name_id

--Update Pokemon attack value given Pokemon's name
UPDATE Pokemon SET attack = :attackInput WHERE pokemon_name = :pokemon_name

--Filter Queries--
--Display all trainers from a specific region
SELECT * FROM Trainer JOIN Region ON Regions.trainerID = Trainers.region

--Delete Queries--
--Delete all trainers with given specific gender
DELETE FROM Trainer WHERE unique_player_id = :unique_player_idInput

--Delete all Pokemon with given ability 1
DELETE FROM Pokemon WHERE ability_1 = :ability_1Input

--Delete all Regions with given name
DELETE FROM Region WHERE region_name = :region_nameInput