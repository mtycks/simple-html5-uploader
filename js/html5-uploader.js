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

  //Check to see if there are files and if FileReader is available
  //If both do NOT pass, then we're done here
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
      var html = "<tr>";
        html += "<td><img src=\"" + e.target.result + "\"></td>";
        html += "<td>" + f.name + "</td>";
        html += "<td>" + bytesToSize(f.size) + "</td>";
      html += "<tr>";
      fileTableBody.innerHTML += html;
    }

    reader.readAsDataURL(f);

  });


}

function bytesToSize(bytes) {
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes == 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};
