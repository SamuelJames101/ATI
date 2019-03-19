let oldData = {};
let tdmappings = {
  name: 0, model_name: 1, port: 2, os: 3, os_version: 4, connection: 5
}

$('.editbtn').on("click", editClicked);
$('.cancelbtn').on("click", cancelClicked);
$('.savebtn').on("click", saveClicked);
$('.deletebtn').on("click", deleteClicked);

function editClicked(e){
  let deviceID = $(this).parent().data('deviceid');
  let rowArray = $(`[data-deviceid=${deviceID}]`);

  let rowInputs = rowArray.filter((index, row) => row.className.indexOf('inputable') != -1);
  let rowButtons = rowArray.filter((index, row) => row.className.indexOf('button') != -1);

  let data = rowInputs.map((index,row)=> row.innerHTML);
  oldData[deviceID] = data;

  for (let i = 0; i < rowInputs.length; i++ ){

    let td = $(`[data-deviceid=${deviceID}]`).eq(i);
    let tdValue = td[0].innerHTML;
    let input;

    if (rowInputs[i].className.indexOf('onOff') != -1){
      if(rowInputs[i].innerText === "on"){
        input = `<input type="checkbox" name="connected" checked>`
      } else {
        input = `<input type="checkbox" name="connected">`
      }
    }else{
      input = `<input value = "${tdValue}" ></input>`;
    }
    $(rowInputs).eq(i).html(input);
  }

  toggleHidden(rowButtons);

}

function cancelClicked(e){
  let deviceID = $(this).parent().data('deviceid');
  let rowArray = $(`[data-deviceid=${deviceID}]`);
  let rowInputs = rowArray.filter((index, row) => row.className.indexOf('inputable') != -1);
  let rowButtons = rowArray.filter((index, row) => row.className.indexOf('button') != -1);

  let input = oldData[deviceID];
  toggleHidden(rowButtons);
  for (i = 0; i < rowInputs.length; i++){
    $(rowInputs).eq(i).html(input[i]);
  }
}

function saveClicked(e){
  let deviceID = $(this).parent().data('deviceid');
  let rowArray = $(`[data-deviceid=${deviceID}]`);
  let rowInputs = rowArray.filter((index, row) => row.className.indexOf('inputable') != -1);
  let rowButtons = rowArray.filter((index, row) => row.className.indexOf('button') != -1);

  let data = [];
  for (let i = 0; i < rowInputs.length; i++ ){
    let td = $(`[data-deviceid=${deviceID}]`).eq(i);
    let child = $(td.children()[0]);

    let tdValue;
    if(child.attr('type')=='checkbox'){
      tdValue = child.prop('checked');
    } else {
      tdValue = child.val();
    }
    data.push(tdValue)
  }

  let connection = data[5] ? 1:0;
  let dataObj = {id:deviceID, name:data[0], model_name:data[1], port: data[2], os:data[3], os_version:data[4], connection};
  $.post('/editDevice', dataObj, function(obj){
    if(!obj.error){
        let data = dataObj.id
        $.get(`/getDevice/${data}`, function(obj){
          toggleHidden(rowButtons);
          let objKeys = Object.keys(obj.device);
          for (let i = 0; i < objKeys.length; i++ ){
            let tdIndex = tdmappings[objKeys[i]];
            if (tdIndex === undefined){
              continue;
            }
            let td = rowInputs[tdIndex];

            if (rowInputs[tdIndex].className.indexOf('onOff') != -1){
              console.log(obj.device[objKeys[i]]);
              input = obj.device[objKeys[i]] === 1 ?  "on" :  "off"
            }else{
              input = obj.device[objKeys[i]];
            }

            $(rowInputs).eq(tdIndex).html(input);
          }
        });
    }
  });
}

function deleteClicked(e){
  let id = $(this).parent().data('deviceid');
  $.post('/removeDevice', {id:id}, function(error){
    if(!error){
      console.log(error)
      $(`.row_${id}`).remove();
    }else {
      $('#deviceUpdateErrors'.text(`Errors:${error}`))
    }
  })
}

function toggleHidden(rowButtons) {
  rowButtons.find("a").toggleClass("hidden");
}

//ignore
