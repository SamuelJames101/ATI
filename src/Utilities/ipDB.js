import mysql from "mysql";

export class ipDB{

  static getInstance(){
    if (DB.connection){
      return DB.connection
    }
    DB.connection =
      mysql.createConnection({
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: 'rootroot',
      database: 'automationGo',
      socketPath: '/tmp/mysql.sock'
    });

    DB.connection.connect(function(err){
      if(err){
        console.log('Can not connect to database.');
      } else {
        console.log('Connected to database.')
      }
    });

    return DB.connection
  }

  static getAll(table, callback){
    DB.getInstance().query(`SELECT * FROM ${table}`, function(ipDBGetAllerror, results, fields){
      if(dbGetAllerror){
        console.log('Could not get ip database information: ', ipDBGetAllerror);
      }else {
      }
      callback(ipDBGetAllerror, results);
    });
  }

  static update (table, data, callback){
    let id = data.id;
    delete data.id;
    let query = DB.getInstance().format(`UPDATE ${table} SET ? WHERE ID = ${id}`, data);

    DB.getInstance().query(query, function (updateIPError, results, fields){
      callback(updateIPError, results)
    });
  }
}
