let request = new XMLHttpRequest();

request.open('GET', 'https://gorest.co.in/public/v1/users?access-token=d65c1eb53080a7e1585ec8734451807790d83c28532025a568ef7c9d03bb29d8', true);
request.onload = function () {
  // Begin accessing JSON data here
  let datalist = JSON.parse(this.response);

  if (request.status >= 200 && request.status < 400) {
    for(i in datalist.data){
      document.getElementById("displaytable").innerHTML += "<tr id='row" + i + "'><td>" + datalist.data[i].name +
      "</td><td>" + datalist.data[i].email + "</td><td>" + datalist.data[i].gender + "</td><td>" + datalist.data[i].status +
      "</td><td>" + "<a class='mdl-list__item-secondary-action' href=''><i class='material-icons'>delete</i></a></td></tr>";
    }
  }
else {
    console.log('error');
  }
}
request.send();

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
  request.open('POST', 'https://gorest.co.in/public/v1/users?access-token=d65c1eb53080a7e1585ec8734451807790d83c28532025a568ef7c9d03bb29d8', true);
  request.setRequestHeader("Content-type", "application/json");
  request.setRequestHeader("Authorization", "Bearer d65c1eb53080a7e1585ec8734451807790d83c28532025a568ef7c9d03bb29d8");
  request.send('{"name":"'+name+'","gender":"'+gender+'","email":"'+email+'","status":"'+status+'"}');

}
