use cis557;
DROP TABLE user_chat_table;
CREATE TABLE `user_chat_table`(
  `group_id` VARCHAR(256) NOT NULL,
  `timestamp` BIGINT NOT NULL,
  `sender` VARCHAR(64) NOT NULL,
  `receiver` VARCHAR(64),
  `message` MEDIUMBLOB,
  `message_type` VARCHAR(32) NOT NULL,
  `mimetype` VARCHAR(32) NOT NULL,
  PRIMARY KEY ( `group_id`, `timestamp` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

select mimetype from user_chat_table;
truncate user_chat_table;

ALTER TABLE post_table ADD `create_time` BIGINT NOT NULL;
ALTER TABLE post_table ADD `post_content` MEDIUMBLOB;
ALTER TABLE post_table ADD `message_type` VARCHAR(32) NOT NULL;
ALTER TABLE post_table ADD `mimetype` VARCHAR(32) NOT NULL;
ALTER TABLE user_table ADD `avatar` MEDIUMBLOB;
ALTER TABLE user_table ADD `mimetype` VARCHAR(32);

use cis557;
truncate user_chat_table;
select * from post_table;
DROP TABLE post_table;
CREATE TABLE `post_table`(
  `post_id` VARCHAR(50) NOT NULL,
  `create_time` BIGINT NOT NULL,
  `creator_id` VARCHAR(50) NOT NULL,
  `group_id` VARCHAR(50),
  `post_content` MEDIUMBLOB,
  `message_type` VARCHAR(32) NOT NULL,
  `mimetype` VARCHAR(32) NOT NULL,
  PRIMARY KEY ( `post_id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `post_attachment`(
  `attachement_id` INT UNSIGNED AUTO_INCREMENT,
  `post_id` VARCHAR(50) NOT NULL,
  `post_content` MEDIUMBLOB,
  `message_type` VARCHAR(32) NOT NULL,
  `mimetype` VARCHAR(32) NOT NULL,
  PRIMARY KEY ( `attachement_id` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `general_notification`(
  `nid` VARCHAR(50) NOT NULL,
  `user_name` VARCHAR(50) NOT NULL,
  `message` VARCHAR(256) NOT NULL,
  `create_time` BIGINT,
  PRIMARY KEY ( `nid` )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE post_table ADD flaggedId VARCHAR(50);

select * from user_table where user_id = "5b746bd-cdee-301d-fe5-cfe4064af26f";
