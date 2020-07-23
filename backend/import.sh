#! /bin/bash
mongoimport --legacy --db test --collection users --file ./database/default/users.json --jsonArray 
mongoimport --legacy --db test --collection roles --file ./database/default/roles.json --jsonArray
mongoimport --legacy --db test --collection folders --file ./database/default/folder.json --jsonArray
mongoimport --legacy --db test --collection files --file ./database/default/file.json --jsonArray