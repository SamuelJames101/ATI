import mysql from "mysql";

export class DB{

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
        console.log(err)
        console.log('Can not connect to database.');
      } else {
        console.log('Connected to database.')
      }
    });

    return DB.connection
  }

  static insert (table, data, callback){
    let query = mysql.format(`INSERT INTO ${table} SET ?`, data);
      DB.getInstance().query(query, function (dbAddError, results, fields){
        if (dbAddError){
          console.log("Can't add new device into database: ", dbAddError)
        }else {
        }
        callback(dbAddError, results);
    });
  }

  static getDevice(table, data, callback){
    let query = mysql.format(`SELECT * FROM ${table} WHERE ID = ?`, data);
    DB.getInstance().query(query, function (getDeviceError, results, fields){
      if (getDeviceError){
        console.log("Can't add new device into database: ", getDeviceError)
      }else {
      }
      callback(getDeviceError, results[0]);
    });
  }

  static getAll(table, callback){
    DB.getInstance().query(`SELECT * FROM ${table}`, function(dbGetAllerror, results, fields){
      if(dbGetAllerror){
        console.log('Could not get database information: ', dbGetAllerror);
      }else {
      }
      callback(dbGetAllerror, results);
    });
  }

  static remove (table, data, callback){
    DB.getInstance().query(`DELETE FROM ${table} WHERE ID = ${data}`, function (removeError, results, fields) {
      if (removeError){

      }else {
      }
      callback(removeError, results);
    });
  }

  static update (table, data, callback){
    let id = data.id;
    delete data.id;
    let query = DB.getInstance().format(`UPDATE ${table} SET ? WHERE ID = ${id}`, data);

    DB.getInstance().query(query, function (updateError, results, fields){
      callback(updateError, results)
    });
  }
}
