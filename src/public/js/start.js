let oldData = {};
let selectedRowID;
let selectedautoDeviceTableID;
let editToggleClicked = true;
let tdmappings = {
  name: 0, model_name: 1, port: 2, os: 3, os_version: 4, connection: 5
}

$('.editbtn').on("click", editClicked);
$('.cancelbtn').on("click", cancelClicked);
$('.savebtn').on("click", saveClicked);
$('.deletebtn').on("click", deleteClicked);
$('.startbtn').on("click", startClicked);
$('.autostartbtn').on("click", autoStartClicked);
$('.autostartsubmitbutton').on("click", autoStartSubmitClicked);
$('.close').on("click", autoStartCloseClicked);
$('.stopautorun').on("click", autoStartedDeviceStop);
$('.deleteautorun').on("click", autoStartedDeviceDelete);

for (let i=1; i< $('#deviceTable tr').length; i++){
  let rowNumber = $('#deviceTable tr')[i];
  //let deviceID = $(rowNumber).attr('class');
  $(rowNumber).on("click", function(){
    rowClicked(this);
  })
};

function rowClicked(elm){
  for (let i=1; i< $('#deviceTable tr').length; i++){
    $('#deviceTable tr')[i].classList.remove('highlight')
  };

  if (editToggleClicked) {
    elm.classList.add('highlight');
    selectedRowID = $(elm).attr('id');
    $("button").attr("disabled", false);
  };
};

for (let i=0; i< $('.autodevicetable').length; i++){
  console.log(i);
  let tableNumber = $('.autodevicetable')[i];
  $(tableNumber).on("click", function(){
    autoDeviceTableClicked(this);
  })
};

function autoDeviceTableClicked(elm){
  for (let i=1; i< $('.autodevicetable').length; i++){
    $('.autodevicetable')[i].classList.remove('highlight')
  };
  elm.classList.add('highlight');
  selectedautoDeviceTableID = $(elm).data("autodeviceid");
  $(".autoScriptButton").attr("disabled", false);
}

function startClicked(e){
  console.log("clicked works")
  let deviceID = selectedRowID;
  let rowArray = $(`[data-deviceid=${deviceID}]`);
  let portNumber = $(rowArray)[2].innerText
  $.post('/start', {portNumber:portNumber}, function(obj){
  });
}

function editClicked(e){
  editToggleClicked = false;
  for (let i=1; i< $('#deviceTable tr').length; i++){
    $('#deviceTable tr')[i].classList.remove('highlight')
  };

  let deviceID = selectedRowID;
  //let deviceID = $(this).parent().data('deviceid');
  let rowArray = $(`[data-deviceid=${deviceID}]`);

  let rowInputs = rowArray.filter((index, row) => row.className.indexOf('inputable') != -1);

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

  toggleHidden();

}

function cancelClicked(e){

  for (let i=1; i< $('#deviceTable tr').length; i++){
    $('#deviceTable tr')[i].classList.remove('highlight')
  };

  $(".errorNote").remove();
  $("button").attr("disabled", true);
  editToggleClicked = true;

  let deviceID = selectedRowID;
  //let deviceID = $(this).parent().data('deviceid');
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
  editToggleClicked = true;
  let deviceID = selectedRowID;
  //let deviceID = $(this).parent().data('deviceid');
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
  $.post('/device/edit', dataObj, function(obj){
    console.log(obj);
    if(!obj.error){
        let data = dataObj.id
        $.get(`/device/${data}`, function(obj){
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
    } else {
      $(".errorsBox").append(`<p class = "errorNote">${obj.error}</P>`);
    }
  });
}

function deleteClicked(e){
  let id = selectedRowID;
  //let id = $(this).parent().data('deviceid');
  $.post('/device/remove', {id:id}, function(error){
    if(!error){
      $(`.row_${id}`).remove();
    }else {
      $('#deviceUpdateErrors'.text(`Errors:${error}`))
    }
  })
}

function autoStartClicked(e){
  $(".popupphoneselected").html(`<p class="popupphoneselected">Device ID Selected: ${selectedRowID}</p>`);

  let deviceID = selectedRowID;
  let rowArray = $(`[data-deviceid=${deviceID}]`);
  let portNumber = $(rowArray)[2].innerText

  $("#auto-device-id").val(deviceID);
  $("#deviceport").val(portNumber);
  $('#autostartmodal').css("display", "block");
}

function autoStartSubmitClicked(e){
  $('#autostartpopup').toggleClass("popuphidden");
}

function autoStartCloseClicked(e){
  $('#autostartmodal').css("display", "none");
}

function autoStartedDeviceStop(e){
  $.post('start/auto/stop', {deviceID:selectedautoDeviceTableID}, function(data, working){
    console.log(data);
    let test = $(`[data-autodeviceid=${selectedautoDeviceTableID}]`);
    test.find('.autorunning td')[0].innerText="Status: Not Running";
  })
}

function autoStartedDeviceDelete(e){
  let test = $(`[data-autodeviceid=${selectedautoDeviceTableID}]`);
  $.post('start/auto/delete', {deviceID:selectedautoDeviceTableID}, function(data, working){
    console.log(data.list);
    if (data.deleted){
      test.remove();
      $(".autoDeviceTabNumber").html(`<p class="autoDeviceTabNumber">${data.list.length}</p>`);
    }
  })
}


function toggleHidden() {
  $('.button').find("button").toggleClass("hidden");
}

//ignore
