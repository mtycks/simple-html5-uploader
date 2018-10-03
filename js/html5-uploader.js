// Based on Raymond Camden's blog post here:
// https://www.raymondcamden.com/2013/09/10/Adding-a-file-display-list-to-a-multifile-upload-HTML-control


var fileTable = "";

//Initialize the plugin
document.addEventListener("DOMContentLoaded", init, false);

function init() {

  //Add a listner to the #files input
  document.querySelector('#files').addEventListener('change', handleFileSelect, false);

  //Create variables for the table and table body
  fileTable = document.querySelector("#selectedFiles-container");
  fileTableBody = document.querySelector("#selectedFiles");

}

function handleFileSelect(e) {

  if(!e.target.files || !window.FileReader)return;

  fileTableBody.innerHTML = "";

  var files = e.target.files;
  var filesArr = Array.prototype.slice.call(files);

  //Show or hide table based on filesArr
  if( filesArr.length < 1 ){
    fileTable.style.display = "none";
  }else{
    fileTable.style.display = "block";
  }

  filesArr.forEach(function(f) {

    if(!f.type.match("image.*")) {
      return;
    }

    var reader = new FileReader();
    reader.onload = function (e) {
      var html = "<tr><td><img src=\"" + e.target.result + "\"></td><td>" + f.name + "</td></tr>";
      fileTableBody.innerHTML += html;
    }

    reader.readAsDataURL(f);

  });


}
