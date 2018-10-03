// Based on Raymond Camden's blog post here:
// https://www.raymondcamden.com/2013/09/10/Adding-a-file-display-list-to-a-multifile-upload-HTML-control


var fileTable = "";

document.addEventListener("DOMContentLoaded", init, false);

function init() {
  document.querySelector('#files').addEventListener('change', handleFileSelect, false);
  fileTable = document.querySelector("#selectedFiles-container");
  fileTableBody = document.querySelector("#selectedFiles");
}

function handleFileSelect(e) {

  if(!e.target.files || !window.FileReader){
    fileTable.style.display = "none";
    return;
  }

  //If there are files that have been selected, unhide the table
  fileTable.style.display = "block";

  fileTableBody.innerHTML = "";

  var files = e.target.files;
  var filesArr = Array.prototype.slice.call(files);
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
