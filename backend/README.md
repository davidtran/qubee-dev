## SET UP DB DOCUMENT
### Install RS
  npm install run-rs -g
### Run
  Run `run-rs --mongod` and will receive url as:  `mongodb://DESKTOP-RLFJ2HD:27017,DESKTOP-RLFJ2HD:27018,DESKTOP-RLFJ2HD:27019?replicaSet=rs`  

  Convert it to: 
  
  `mongodb://DESKTOP-RLFJ2HD:27017,DESKTOP-RLFJ2HD:27018,DESKTOP-RLFJ2HD:27019/dbName?replicaSet=rs&readPreference=primary&connectTimeoutMS=10000&3t.uriVersion=3&3t.connection.name=rs&3t.databases=dbName`

  Put it in enviroment json file in config folder
### Start server
  Run npm server
  
