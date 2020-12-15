#!/bin/bash
rm -f storage/db.sqlite
<<<<<<< HEAD
npx sequelize-cli db:migrate:undo:all
=======
npx sequelize-cli db:migrate:undo:all 
>>>>>>> de1d03c1a87975f89cfc408b47b4dd5819b96e91
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all  
