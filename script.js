let request = new XMLHttpRequest();
let page = 1;
let maxPage = 0;
let pageOption = "";
let temp;
let URL = 'https://gorest.co.in/public/v1/users';

// refresh page every 2 seconds
let livedata = setInterval(reload,2000);

// handle http requests
function handleHttp(action, url, value, resolve){
  let request = new XMLHttpRequest();

  request.onreadystatechange = function(){
    if(this.status >= 200 && this.status < 400 && this.readyState == 4){
      if(resolve){
        resolve(JSON.parse(this.response));
      }
    }
    else if(this.status >= 400){
      alert("Error code: " + this.status + "\nMessage: " + this.statusText);
      }
    };

  request.open(action,url);
  request.setRequestHeader("Content-type", "application/json");
  request.setRequestHeader("Authorization", "Bearer d65c1eb53080a7e1585ec8734451807790d83c28532025a568ef7c9d03bb29d8");

  if(value){
    request.send(value);
  }
  else{
    request.send();
  }
}

// retrieve user data
function reload(){
  let thisUrl = "";
  if(page != 1){
    thisUrl = 'https://gorest.co.in/public/v1/users?page=' + page;
  }
  else {
    thisUrl = 'https://gorest.co.in/public/v1/users?';
  }

  handleHttp('GET', thisUrl, null, function(datalist){
    document.getElementById("displaytable").innerHTML= " "
    document.getElementById("currentPage").innerHTML= "Page "+ page

    if(datalist.meta != null){
      listAll(datalist);
      maxPage = datalist.meta.pagination.pages;
      if(maxPage!= temp){
        pageOption = "";
        for(let i=1; i<maxPage+1; i++){
          pageOption += "<option value='" + i + "'>" + i + "</option>";
        }
        document.getElementById("selectPage").innerHTML = pageOption;
      }
      temp = maxPage;
    }
    else{
      maxPage = temp;
    }
  });
}

// display user data in table format
function listAll(datalist){
  for(e in datalist.data){
      document.getElementById("displaytable").innerHTML += "<tr id='row" + e + "' contenteditable=\"false\"><td id='id" + e + "'>" + datalist.data[e].id +
      "</td><td id='name" + e + "'>" + datalist.data[e].name + "</td><td id='email" + e + "'>" + datalist.data[e].email + "</td><td id='gender" + e + "'>" +
      datalist.data[e].gender + "</td><td id='status" + e + "'>" + datalist.data[e].status +
      "</td><td><button class='mdl-button mdl-js-button mdl-button--icon' onclick=\"deleteUser(" + datalist.data[e].id + ")\"><i class='material-icons'>delete</i></button></td>"+
      "<td><button class='mdl-button mdl-js-button mdl-button--icon' id=\"editbtn" + e + "\"onclick=\"enableEdit("+ e + ")\"><i class='material-icons'>edit</i></button></td>"+
      "<td><button class='mdl-button mdl-js-button' id=\"savebtn" + e + "\" onclick=\"saveEdit("+ e + "," + datalist.data[e].id + ")\">save</button></td>"+
      "<td><button class='mdl-button mdl-js-button' id=\"cancelbtn" + e + "\" onclick=\"cancelEdit("+ e + ")\">cancel</button></td></tr>";
  }
}

// create new user
function createUser(){
  let name = document.getElementById("nameinput").innerText;
  let email = document.getElementById("emailinput").innerText;
  let gender = document.getElementById("genderlist").value;
  let status = document.getElementById("statuslist").value;

  handleHttp('POST', URL, '{"name":"'+name+'","gender":"'+gender+'","email":"'+email+'","status":"'+status+'"}', function(){
    alert("New user added successfully");
    // reset input field
    document.getElementById("nameinput").innerHTML = "";
    document.getElementById("emailinput").innerHTML = "";
    document.getElementById('genderlist').selectedIndex = 0;
    document.getElementById('statuslist').selectedIndex = 0;
  });
}

// remove user
function deleteUser(currUser){
  handleHttp('DELETE', URL + '/' + currUser, null, null);
}

// show save and delete icons. make input field editable
function enableEdit(curr){
  // pause refreshing
  clearInterval(livedata);
  livedata = null;
  document.getElementById("row"+curr).setAttribute("contenteditable", true)
  document.getElementById("savebtn"+curr).style.visibility = "visible"
  document.getElementById("cancelbtn"+curr).style.visibility = "visible"
  document.getElementById("editbtn"+curr).style.visibility = "hidden"
}

// close edit mode
function cancelEdit(curr){
  document.getElementById("row"+curr).setAttribute("contenteditable", false)
  document.getElementById("savebtn"+curr).style.visibility = "hidden"
  document.getElementById("cancelbtn"+curr).style.visibility = "hidden"
  document.getElementById("editbtn"+curr).style.visibility = "visible"
  // resume refreshing
  livedata = setInterval(reload,2000);
}

// save new changes
function saveEdit(currRow, currUserId){
  document.getElementById("row"+currRow).setAttribute("contenteditable", false)
  document.getElementById("editbtn"+currRow).style.visibility = "visible"
  document.getElementById("savebtn"+currRow).style.visibility = "hidden"
  document.getElementById("cancelbtn"+currRow).style.visibility = "hidden"

  let name = document.getElementById("name"+currRow).innerText;
  let email = document.getElementById("email"+currRow).innerText;
  let gender = document.getElementById("gender"+currRow).innerText;
  let status = document.getElementById("status"+currRow).innerText;

  // check validity of data input
  if(gender != 'male' &&  gender != 'female'){
    alert("Please enter either \"male\" or \"female\"");
  }
  else if(status != 'active' && status != 'inactive'){
    alert("Please enter either \"active\" or \"inactive\"");
  }
  else{
    handleHttp('PUT', URL + '/' + currUserId, '{"name":"'+name+'","gender":"'+gender+'","email":"'+email+'","status":"'+status+'"}', function(){
      alert("Edited successfully\nName: " + name + "\nEmail: " + email + "\nGender: " + gender + "\nStatus: " + status);
    });
  }
  // resume refreshing
  livedata = setInterval(reload,2000);
}

// navigate to next page
function goNextPage(){
  if(page < maxPage){
    page = page + 1;
  }
}

// navigate to previous page
function goPrevPage(){
  if(page > 1){
    page -= 1;
  }
}

// navigate to selected page
function goSelectedPage(){
  page = parseInt(document.getElementById("selectPage").value);
}

// identify specific user based on id inputted
function findUser(){
  clearInterval(livedata);
  livedata = null;

  let idnum = document.getElementById("findId").value;

  handleHttp('GET', URL + '/' + idnum, null, function(datalist){
    document.getElementById("displaytable").innerHTML= " ";
    document.getElementById("currentPage").innerHTML= "Page "+ page

    if(datalist.data.length != 'undefined'){
      listAll(datalist);
    }});
  // resume refreshing
  //livedata = setInterval(reload,2000);
}

// display navigate button when page loads
document.getElementById("pagenum").innerHTML = "<button class=\"mdl-button mdl-js-button mdl-button--icon\" onclick=\"goPrevPage()\"><i class=\"material-icons\">arrow_back_ios</i></button><label id=\"currentPage\"></label>"
+"<button class=\"mdl-button mdl-js-button mdl-button--icon\" onclick=\"goNextPage()\"><i class=\"material-icons\">arrow_forward_ios</i></button><br><br>";
