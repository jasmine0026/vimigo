let request = new XMLHttpRequest();
let page = 1;

function read(page){
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      let datalist = JSON.parse(this.response);
      listAll(datalist);
    }
  }
}

request.open('GET', 'https://gorest.co.in/public/v1/users?page=1', true);
request.setRequestHeader("Content-type", "application/json");
request.setRequestHeader("Authorization", "Bearer d65c1eb53080a7e1585ec8734451807790d83c28532025a568ef7c9d03bb29d8");
request.send();

function listAll(datalist){
  for(i in datalist.data){
    document.getElementById("displaytable").innerHTML += "<tr id='row" + i + "'><td>" + datalist.data[i].name +
    "</td><td>" + datalist.data[i].email + "</td><td>" + datalist.data[i].gender + "</td><td>" + datalist.data[i].status +
    "</td><td><button class='mdl-button mdl-js-button mdl-button--icon' onclick=\"deleteUser(" + datalist.data[i].id + ")\"><i class='material-icons'>delete</i></button></td>"+
    "<td><button class='mdl-button mdl-js-button mdl-button--icon' onclick=\"editUser(" + datalist.data[i].id + ")\"><i class='material-icons'>edit</i></button></td></tr>";
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

function editUser(currUser){
  request.open('PUT', 'https://gorest.co.in/public/v1/users/' + currUser, true);
  request.setRequestHeader("Content-type", "application/json");
  request.setRequestHeader("Authorization", "Bearer d65c1eb53080a7e1585ec8734451807790d83c28532025a568ef7c9d03bb29d8");
  request.send();
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
read(page);
document.getElementById("pagenum").innerHTML = "<button class=\"mdl-button mdl-js-button mdl-button--icon\"><i class=\"material-icons\">arrow_back_ios</i></button>Page 1"
+"<button class=\"mdl-button mdl-js-button mdl-button--icon\" onclick=\"nextPage()\"><i class=\"material-icons\">arrow_forward_ios</i></button><br><br>";
