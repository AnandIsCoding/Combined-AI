signin
create new project
click -> connect to DB -> get connection string -> paste in .env

npm install @neondatabase/serverless dotenv

than create a db.config.js inside configs and do like same

than go to console.neon.tech sql editor (make sure to select current project)

to create table there in sql editor write ===>>
CREATE TABLE creations (
id SERIAL PRIMARY KEY,
user_id TEXT NOT NULL,
prompt TEXT NOT NULL,
content TEXT NOT NULL,
type TEXT NOT NULL,
publish BOOLEAN DEFAULT FALSE,
likes TEXT[] DEFAULT '{}',
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()

)

connect clerk with express===>>
npm install @clerk/express
