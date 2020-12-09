# Banking-App

### Step 0

* Generated the initial project using *npm init*
* Installed Express using *npm install express*


### Step 1
* *npm install sqlite3*
* *npm install --save sequelize*
* create folder storage and a file db.sqlite
* *npx sequelize-cli init* - this will create the folders config, migrations, models and seeders
* changed config.json file
* generate a model: npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,phone:string,email:string,password:string 
* *npx sequelize-cli db:migrate* to execute a migration
* now you can see that User table was created
* *npx sequelize-cli db:migrate:undo* to delete the last migration
* create seed: *npx sequelize-cli seed:generate --name seed-users* 
* to execute seeds *npx sequelize-cli db:seed:all*
* *npm install faker --save-dev* for faker

### Step 2: add a relationship
* update the tabels from models in static associate(models) + add userId (for example) in one table as foreign key (in migration)
* delete db.sqlite
* execute *npx sequelize-cli db:migrate:undo:all*
* then execute again the migrations *npx sequelize-cli db:migrate*

### Step 3: GraphQL
* execute *npm install --save graphql*
* binding between express and GraphQL *npm install --save express-graphql* 