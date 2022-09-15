
DROP TABLE IF EXISTS
    `Storage`,
    `Pokemon`,
    `Trainer`,
    `Region`;

CREATE TABLE `Region` (
    `unique_region_id` INT(1) NOT NULL AUTO_INCREMENT,
    `region_name` VARCHAR(15) NOT NULL,
    UNIQUE KEY `region_name` (`region_name`),
    PRIMARY KEY (`unique_region_id`)
);

INSERT INTO `Region` (`region_name`)
VALUES
    ("Kanto"),
    ("Johto");

CREATE TABLE `Trainer` (
    `unique_player_id` INT AUTO_INCREMENT NOT NULL,
    `name_id` VARCHAR(12) NOT NULL,
    `gender` VARCHAR(1) NOT NULL,
    `age` INT NOT NULL,
    `region` INT NOT NULL,
    PRIMARY KEY (`unique_player_id`),
    FOREIGN KEY (`region`) REFERENCES `Region` (`unique_region_id`)
);

INSERT INTO `Trainer` (`name_id`, `gender`, `age`, `region`)
VALUES
    ("chrisndubs", "M", 69, 1),
    ("swervin", "M", 96, 2);

CREATE TABLE `Pokemon` (
    `breed_id` INT(3) AUTO_INCREMENT UNIQUE NOT NULL,
    `pokemon_name` VARCHAR(12) NOT NULL,
    `health` INT(3) NOT NULL,
    `attack` INT(3) NOT NULL,
    `defence` INT(3) NOT NULL,
    `special_atk` INT(3) NOT NULL,
    `special_def` INT(3) NOT NULL,
    `speed` INT(3) NOT NULL,
    `type_1` VARCHAR(15) NOT NULL,
    `type_2` VARCHAR(15),
    `ability_1` VARCHAR(15) NOT NULL,
    `ability_2` VARCHAR(15),
    `hidden_ability` VARCHAR(15),
    PRIMARY KEY(`breed_id`)
);

INSERT INTO `Pokemon` (`pokemon_name`, `health`, `attack`, `defence`, `special_atk`, `special_def`, `speed`, `type_1`, `type_2`,  `ability_1`, `ability_2`, `hidden_ability`)
VALUES
    ("Pikachu", 10, 20, 12, 10, 15, 25, "Lightning", NULL, "Static", NULL, NULL),
    ("Squirtle", 15, 25, 24, 15, 20, 30, "Water", NULL, "Water Gun", NULL, NULL);

CREATE TABLE `Storage` (
    `index` INT AUTO_INCREMENT KEY NOT NULL,
    `pid` INT NOT NULL,
    `pokeid` INT NOT NULL,
    FOREIGN KEY(`pid`) REFERENCES `Trainer`(`unique_player_id`),
    FOREIGN KEY(`pokeid`) REFERENCES `Pokemon`(`breed_id`)
);

INSERT INTO `Storage` (`pid`, `pokeid`)
VALUES
    (1, 1),
    (2, 2);
