let request = new XMLHttpRequest();
let page = 1;
let maxPage = 0;
let pageOption = "";

setInterval(function (){
  request.onreadystatechange = function (){
    if(this.readyState == 4 && this.status == 200){
      let datalist = JSON.parse(this.response);
      document.getElementById("displaytable").innerHTML= " "
      document.getElementById("currentPage").innerHTML= "Page "+ page
      listAll(datalist);
      pageOption = "";
      for(let i=1; i<maxPage; i++){
        pageOption += "<option value='" + i + "'>" + i + "</option>";
      }
      document.getElementById("selectPage").innerHTML = pageOption;
    }
  }
  if(page != 1){
    request.open('GET', 'https://gorest.co.in/public/v1/users?page=' + page, true);
  }
  else {
    request.open('GET', 'https://gorest.co.in/public/v1/users?', true);
  }

  request.setRequestHeader("Content-type", "application/json");
  request.setRequestHeader("Authorization", "Bearer d65c1eb53080a7e1585ec8734451807790d83c28532025a568ef7c9d03bb29d8");
  request.send();
},2000)


function listAll(datalist){
  maxPage = datalist.meta.pagination.pages;
  for(e in datalist.data){
    if(datalist.data[e].id !== "undefined"){
      document.getElementById("displaytable").innerHTML += "<tr id='row" + e + "' contenteditable=\"false\"><td id='name" + e + "'>" + datalist.data[e].name +
      "</td><td id='email" + e + "'>" + datalist.data[e].email + "</td><td id='gender" + e + "'>" + datalist.data[e].gender + "</td><td id='status" + e + "'>" + datalist.data[e].status +
      "</td><td><button class='mdl-button mdl-js-button mdl-button--icon' onclick=\"deleteUser(" + datalist.data[e].id + ")\"><i class='material-icons'>delete</i></button></td>"+
      "<td><button class='mdl-button mdl-js-button mdl-button--icon' id=\"editbtn" + e + "\"onclick=\"enableEdit("+ e + ")\"><i class='material-icons'>edit</i></button></td>"+
      "<td><button class='mdl-button mdl-js-button' id=\"savebtn" + e + "\" onclick=\"saveEdit("+ e + "," + datalist.data[e].id + ")\">save</button></td>"+
      "<td><button class='mdl-button mdl-js-button' id=\"cancelbtn" + e + "\" onclick=\"cancelEdit("+ e + ")\">cancel</button></td></tr>";
    }
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

  let name = document.getElementById("name"+currRow).innerText;
  let email = document.getElementById("email"+currRow).innerText;
  let gender = document.getElementById("gender"+currRow).innerText;
  let status = document.getElementById("status"+currRow).innerText;

  request.open('PUT', 'https://gorest.co.in/public/v1/users/' + currUserId, true);
  request.setRequestHeader("Content-type", "application/json");
  request.setRequestHeader("Authorization", "Bearer d65c1eb53080a7e1585ec8734451807790d83c28532025a568ef7c9d03bb29d8");
  request.send('{"name":"'+name+'","gender":"'+gender+'","email":"'+email+'","status":"'+status+'"}');
  if(request.status >= 200 && request.status < 400){
    alert("Edited successfully");
  }
}

function goNextPage(){
  if(page < maxPage){
    page += 1;
  }
}

function goPrevPage(){
  if(page > 1){
    page -= 1;
  }
}

function goSelectedPage(){
  page = document.getElementById("selectPage").value;
}

document.getElementById("pagenum").innerHTML = "<button class=\"mdl-button mdl-js-button mdl-button--icon\" onclick=\"goPrevPage()\"><i class=\"material-icons\">arrow_back_ios</i></button><label id=\"currentPage\"></label>"
+"<button class=\"mdl-button mdl-js-button mdl-button--icon\" onclick=\"goNextPage()\"><i class=\"material-icons\">arrow_forward_ios</i></button><br><br>";
