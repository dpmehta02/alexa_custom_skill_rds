-- Thile file belongs in the companion App repo

-- TEMPORARY!
DROP TABLE events;
DROP TABLE chains;
DROP TABLE users;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL NOT NULL PRIMARY KEY,
  amazon_id VARCHAR(300) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS chains (
  id SERIAL NOT NULL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(300) -- SHOULD BE UNIQUE TO USER, only lower case
  -- url_name VARCHAR check(translate(url_name, 'abcdefghijklmnopqrstuvwxyz', '') = '') NOT NULL,
);

CREATE TABLE IF NOT EXISTS events (
  id SERIAL NOT NULL PRIMARY KEY,
  chain_id INTEGER REFERENCES chains(id) ON DELETE CASCADE,
  name VARCHAR(300)
);

DELETE FROM users;
DELETE FROM chains;
DELETE FROM events;
INSERT INTO users (amazon_id, email) VALUES ('a_sample_amazon_id', 'dpmehta02@gmail.com');
INSERT INTO chains (user_id, name) VALUES (1, 'My Morning Chain');
INSERT INTO events (chain_id, name) VALUES (1, 'Turn on the lights');

Select * from users inner join chains on (chains.user_id = users.id) inner join events on (chains.id = events.chain_id);
