const table = 'ip';
import {DB} from '../Utilities/ipDB';
export class IP {
  static getAllIP(callback){
    DB.getAll(table, function(getAllIPError, results){
      let ipList = [];
      for (let i = 0; i < results.length; i++){
        let newip = new IP(results[i]);
        deviceList.push(newip);
      }
      callback(getAllIPError, ipList);
    })
  }

static  updateIP(data, callback){
    DB.update(table, data, function(updateIPError, results){
      if(!updateIPError){
        let newip = new IP(results)
        callback(updateIPError, results)
      }else {
        callback(updateIPError)
      }
    })
  }
}
