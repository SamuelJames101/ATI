import mysql from "mysql";

export class DB{
  constructor(){
    this.connection = mysql.createConnection({
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: 'rootroot',
      database: 'automationGo',
      socketPath: '/tmp/mysql.sock'
    });

    this.connection.connect(function(err){
      if(err){
        console.log(err)
        console.log('Can not connect to database.');
      } else {
        console.log('Connected to database.')
      }
    });
  }

  insert (table, data, callback){
    let query = mysql.format(`INSERT INTO ${table} SET ?`, data);
      this.connection.query(query, function (dbAddError, results, fields){
        if (dbAddError){
          console.log("Can't add new device into database: ", dbAddError)
        }else {
        }
        callback(dbAddError, results);
    });
  }

  getDevice(table, data, callback){
    let query = mysql.format(`SELECT * FROM ${table} WHERE ID = ?`, data);
    this.connection.query(query, function (getDeviceError, results, fields){
      if (getDeviceError){
        console.log("Can't add new device into database: ", getDeviceError)
      }else {
      }
      callback(getDeviceError, results[0]);
    });
  }

  getAll (table, callback){
    this.connection.query(`SELECT * FROM ${table}`, function(dbGetAllerror, results, fields){
      if(dbGetAllerror){
        console.log('Could not get database information: ', dbGetAllerror);
      }else {
      }
      callback(dbGetAllerror, results);
    });
  }

  remove (table, data, callback){
    this.connection.query(`DELETE FROM ${table} WHERE ID = ${data}`, function (removeError, results, fields) {
      if (removeError){

      }else {
      }
      callback(removeError, results);
    });
  }

  update (table, data, callback){
    let id = data.id;
    delete data.id;
    let query = this.connection.format(`UPDATE ${table} SET ? WHERE ID = ${id}`, data);

    this.connection.query(query, function (updateError, results, fields){
      callback(updateError, results)
    });
  }
}
