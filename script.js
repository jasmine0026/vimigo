let request = new XMLHttpRequest();
let page = 1;

request.onreadystatechange = function(){
  if(this.readyState == 4 && this.status == 200){
    let datalist = JSON.parse(this.response);
    listAll(datalist);
  }
}
request.open('GET', 'https://gorest.co.in/public/v1/users?page=1', true);
request.setRequestHeader("Content-type", "application/json");
request.setRequestHeader("Authorization", "Bearer d65c1eb53080a7e1585ec8734451807790d83c28532025a568ef7c9d03bb29d8");
request.send();

function listAll(datalist){
  for(i in datalist.data){
    document.getElementById("displaytable").innerHTML += "<tr id='row" + i + "' contenteditable=\"false\"><td id='name" + i + "'>" + datalist.data[i].name +
    "</td><td id='email" + i + "'>" + datalist.data[i].email + "</td><td id='gender" + i + "'>" + datalist.data[i].gender + "</td><td id='status" + i + "'>" + datalist.data[i].status +
    "</td><td><button class='mdl-button mdl-js-button mdl-button--icon' onclick=\"deleteUser(" + datalist.data[i].id + ")\"><i class='material-icons'>delete</i></button></td>"+
    "<td><button class='mdl-button mdl-js-button mdl-button--icon' id=\"editbtn" + i + "\"onclick=\"enableEdit("+ i + ")\"><i class='material-icons'>edit</i></button></td>"+
    "<td><button class='mdl-button mdl-js-button' id=\"savebtn" + i + "\" onclick=\"saveEdit("+ i + "," + datalist.data[i].id + ")\">save</button></td>"+
    "<td><button class='mdl-button mdl-js-button' id=\"cancelbtn" + i + "\" onclick=\"cancelEdit("+ i + ")\">cancel</button></td></tr>";
  }
}

function create(){
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let gender,status;
  if(document.getElementById("male-opt").checked){
    gender = document.getElementById("male-opt").value;
  }
  else{
    gender = document.getElementById("female-opt").value;
  }
  if(document.getElementById("active-opt").checked){
    status = document.getElementById("active-opt").value;
  }
  else{
    status = document.getElementById("inactive-opt").value;
  }
  request.open('POST', 'https://gorest.co.in/public/v1/users', true);
  request.setRequestHeader("Content-type", "application/json");
  request.setRequestHeader("Authorization", "Bearer d65c1eb53080a7e1585ec8734451807790d83c28532025a568ef7c9d03bb29d8");
  request.send('{"name":"'+name+'","gender":"'+gender+'","email":"'+email+'","status":"'+status+'"}');
  if(request.status >= 200 && request.status < 400){
    alert("Yay! Created successfully");
  }
}


function deleteUser(currUser){
  request.open('DELETE', 'https://gorest.co.in/public/v1/users/' + currUser, true);
  request.setRequestHeader("Content-type", "application/json");
  request.setRequestHeader("Authorization", "Bearer d65c1eb53080a7e1585ec8734451807790d83c28532025a568ef7c9d03bb29d8");
  request.send();
  if(request.status >= 200 && request.status < 400){
    alert("Deleted successfully");
  }
}

function enableEdit(curr){
  document.getElementById("row"+curr).setAttribute("contenteditable", true)
  document.getElementById("savebtn"+curr).style.visibility = "visible"
  document.getElementById("cancelbtn"+curr).style.visibility = "visible"
  document.getElementById("editbtn"+curr).style.visibility = "hidden"
}

function cancelEdit(curr){
  document.getElementById("row"+curr).setAttribute("contenteditable", false)
  document.getElementById("savebtn"+curr).style.visibility = "hidden"
  document.getElementById("cancelbtn"+curr).style.visibility = "hidden"
  document.getElementById("editbtn"+curr).style.visibility = "visible"
}

function saveEdit(currRow, currUserId){
  document.getElementById("row"+currRow).setAttribute("contenteditable", false)
  document.getElementById("editbtn"+currRow).style.visibility = "visible"
  document.getElementById("savebtn"+currRow).style.visibility = "hidden"
  document.getElementById("cancelbtn"+currRow).style.visibility = "hidden"

  let name = document.getElementById("name"+currRow).value;
  let email = document.getElementById("email"+currRow).value;
  let gender = document.getElementById("gender"+currRow).value;
  let status = document.getElementById("status"+currRow).value;

  console.log(currRow)
  console.log(currUserId)
  console.log(document.getElementById("status"+currRow).value)
  request.open('PUT', 'https://gorest.co.in/public/v1/users/' + currUserId, true);
  request.setRequestHeader("Content-type", "application/json");
  request.setRequestHeader("Authorization", "Bearer d65c1eb53080a7e1585ec8734451807790d83c28532025a568ef7c9d03bb29d8");
  request.send('{"name":"'+name+'","gender":"'+gender+'","email":"'+email+'","status":"'+status+'"}');
  if(request.status >= 200 && request.status < 400){
    alert("Edited successfully");
  }
}

function nextPage(){
  page+=1;
  read(page);
}

/*function read(){
  request.open('GET', 'https://gorest.co.in/public/v1/users?page=1', true);
  request.setRequestHeader("Content-type", "application/json");
  request.setRequestHeader("Authorization", "Bearer d65c1eb53080a7e1585ec8734451807790d83c28532025a568ef7c9d03bb29d8");
  request.send();
  request.onload = function () {
    // Begin accessing JSON data here
    let datalist = JSON.parse(this.response);

    if (request.status >= 200 && request.status < 400) {
      for(i in datalist.data){
        document.getElementById("displaytable").innerHTML += "<tr id='row" + i + "'><td>" + datalist.data[i].name +
        "</td><td>" + datalist.data[i].email + "</td><td>" + datalist.data[i].gender + "</td><td>" + datalist.data[i].status +
        "</td><td><button class='mdl-button mdl-js-button mdl-button--icon' onclick=\"deleteUser(" + datalist.data[i].id + ")\"><i class='material-icons'>delete</i></button></td>"+
        "<td><button class='mdl-button mdl-js-button mdl-button--icon' onclick=\"editUser(" + datalist.data[i].id + ")\"><i class='material-icons'>edit</i></button></td></tr>";
      }
    }
  else {
      console.log('error');
    }
  }
}*/
document.getElementById("pagenum").innerHTML = "<button class=\"mdl-button mdl-js-button mdl-button--icon\"><i class=\"material-icons\">arrow_back_ios</i></button>Page 1"
+"<button class=\"mdl-button mdl-js-button mdl-button--icon\" onclick=\"nextPage()\"><i class=\"material-icons\">arrow_forward_ios</i></button><br><br>";
