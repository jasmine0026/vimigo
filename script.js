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
    // success
    if(this.status >= 200 && this.status < 400 && this.readyState == 4){
      if(resolve){
        resolve(JSON.parse(this.response));
      }
    }
    // error
    else if(this.status >= 400){
      alert("Error code: " + this.status + "\nMessage: " + this.statusText);
      }
    };

  // set header request
  request.open(action,url);
  request.setRequestHeader("Content-type", "application/json");
  request.setRequestHeader("Authorization", "Bearer d65c1eb53080a7e1585ec8734451807790d83c28532025a568ef7c9d03bb29d8");

  // send request
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
  // other than 1
  if(page != 1){
    thisUrl = 'https://gorest.co.in/public/v1/users?page=' + page;
  }
  // first loaded(default)
  else {
    thisUrl = 'https://gorest.co.in/public/v1/users?';
  }

  // call handlehttp function to send GET request
  handleHttp('GET', thisUrl, null, function(datalist){
    document.getElementById("displayTable").innerHTML= " "
    document.getElementById("currentPage").innerHTML= "Page "+ page

    // show all data obtained in table
    if(datalist.meta != null){
      listAll(datalist);
      maxPage = datalist.meta.pagination.pages;
      // generate select page number list
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
      document.getElementById("displayTable").innerHTML += "<tr id='row" + e + "' contenteditable=\"false\"><td id='id" + e + "'>" + datalist.data[e].id +
      "</td><td id='name" + e + "'>" + datalist.data[e].name + "</td><td id='email" + e + "'>" + datalist.data[e].email + "</td><td id='gender" + e + "'>" +
      datalist.data[e].gender + "</td><td id='status" + e + "'>" + datalist.data[e].status +
      "</td><td><button class='mdl-button mdl-js-button mdl-button--icon' onclick=\"deleteUser(" + datalist.data[e].id + ")\"><i class='material-icons'>delete</i></button></td>"+
      "<td><button class='mdl-button mdl-js-button mdl-button--icon' id=\"editBtn" + e + "\"onclick=\"enableEdit("+ e + ")\"><i class='material-icons'>edit</i></button></td>"+
      "<td><button class='mdl-button mdl-js-button' id=\"saveBtn" + e + "\" onclick=\"saveEdit("+ e + "," + datalist.data[e].id + ")\">save</button></td>"+
      "<td><button class='mdl-button mdl-js-button' id=\"cancelBtn" + e + "\" onclick=\"cancelEdit("+ e + ")\">cancel</button></td></tr>";
  }
}

// create new user
function createUser(){
  //obtain input field values
  let name = document.getElementById("nameInput").innerText;
  let email = document.getElementById("emailInput").innerText;
  let gender = document.getElementById("genderList").value;
  let status = document.getElementById("statusList").value;

  // call handlehttp function to perform POST request
  handleHttp('POST', URL, '{"name":"'+name+'","gender":"'+gender+'","email":"'+email+'","status":"'+status+'"}', function(){
    alert("New user added successfully");
    // reset input field
    document.getElementById("nameInput").innerHTML = "";
    document.getElementById("emailInput").innerHTML = "";
    document.getElementById('genderList').selectedIndex = 0;
    document.getElementById('statusList').selectedIndex = 0;
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
  document.getElementById("saveBtn"+curr).style.visibility = "visible"
  document.getElementById("cancelBtn"+curr).style.visibility = "visible"
  document.getElementById("editBtn"+curr).style.visibility = "hidden"
}

// close edit mode
function cancelEdit(curr){
  document.getElementById("row"+curr).setAttribute("contenteditable", false)
  document.getElementById("saveBtn"+curr).style.visibility = "hidden"
  document.getElementById("cancelBtn"+curr).style.visibility = "hidden"
  document.getElementById("editBtn"+curr).style.visibility = "visible"
  // resume refreshing
  livedata = setInterval(reload,2000);
}

// save new changes
function saveEdit(currRow, currUserId){
  document.getElementById("row"+currRow).setAttribute("contenteditable", false)
  document.getElementById("editBtn"+currRow).style.visibility = "visible"
  document.getElementById("saveBtn"+currRow).style.visibility = "hidden"
  document.getElementById("cancelBtn"+currRow).style.visibility = "hidden"

  // obtain data
  let id = document.getElementById("id"+currRow).innerText;
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
    // perform PUT request by calling handleHttp function
    handleHttp('PUT', URL + '/' + currUserId, '{"name":"'+name+'","gender":"'+gender+'","email":"'+email+'","status":"'+status+'"}', function(){
      alert("Edited successfully\nId: " + id + "\nName: " + name + "\nEmail: " + email + "\nGender: " + gender + "\nStatus: " + status);
    });
  }
  // resume refreshing
  livedata = setInterval(reload,2000);
}

// navigate to next page
function goNextPage(){
  // ensure does not exceed max page limit
  if(page < maxPage){
    page = page + 1;
    // resume refreshing
    livedata = setInterval(reload,2000);
  }
}

// navigate to previous page
function goPrevPage(){
  // ensure page number is not less than 1
  if(page > 1){
    page -= 1;
    // resume refreshing
    livedata = setInterval(reload,2000);
  }
}

// navigate to selected page through drop down list
function goSelectedPage(){
  //convert string to integer
  page = parseInt(document.getElementById("selectPage").value);
  // reset option list to default value
  document.getElementById("selectPage").selectedIndex = 0;
  // resume refreshing
  livedata = setInterval(reload,2000);
}

// identify specific user based on id inputted
function findUser(){
  // pause reloading
  clearInterval(livedata);
  livedata = null;

  // obtain user id in input field
  let idnum = document.getElementById("findId").value;

  // perform GET request to determine this id's user
  handleHttp('GET', URL + '/' + idnum, null, function(datalist){
    document.getElementById("displayTable").innerHTML= " ";
    document.getElementById("currentPage").innerHTML= "Page "+ page

    if(datalist.data != null){
      document.getElementById("displayTable").innerHTML = "<tr id='row" + 0 + "' contenteditable=\"false\"><td id='id" + 0 + "'>" + datalist.data.id +
      "</td><td id='name" + 0 + "'>" + datalist.data.name + "</td><td id='email" + e + "'>" + datalist.data.email + "</td><td id='gender" + 0 + "'>" +
      datalist.data.gender + "</td><td id='status" + 0 + "'>" + datalist.data.status + "<td></tr>";
      document.getElementById("findId").value = "";
    }});
}

// display navigate button when page loads
document.getElementById("pageNum").innerHTML = "<button class=\"mdl-button mdl-js-button mdl-button--icon\" onclick=\"goPrevPage()\"><i class=\"material-icons\">arrow_back_ios</i></button><label id=\"currentPage\"></label>"
+"<button class=\"mdl-button mdl-js-button mdl-button--icon\" onclick=\"goNextPage()\"><i class=\"material-icons\">arrow_forward_ios</i></button><br><br>";
