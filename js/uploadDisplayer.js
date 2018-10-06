// Starter code based on Go Make Things' vanilla Javascript plugin
// https://gomakethings.com/a-vanilla-javascript-plugin-boilerplate/
// https://gist.github.com/cferdinandi/57c96241114fc6e8ce6cd2c5bfeeb346


(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        define([], factory(root));
    } else if ( typeof exports === 'object' ) {
        module.exports = factory(root);
    } else {
        root.uploadDisplayer = factory(root);
    }
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

    'use strict';

    //
    // Variables
    //

    var window = root; // Map window to root to avoid confusion
    var publicMethods = {}; // Placeholder for public methods
    var settings;
    var filesArray = [];

    // Default settings
    var defaults = {
        output: 'object',
        selector: '.displayFiles'
    };


    //
    // Methods
    //

    /**
     * Merge two or more objects. Returns a new object.
     * @private
     * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
     * @param {Object}   objects  The objects to merge together
     * @returns {Object}          Merged values of defaults and options
     */
    var extend = function () {

        // Variables
        var extended = {};
        var deep = false;
        var i = 0;
        var length = arguments.length;

        // Check if a deep merge
        if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
            deep = arguments[0];
            i++;
        }

        // Merge the object into the extended object
        var merge = function (obj) {
            for ( var prop in obj ) {
                if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                    // If deep merge and property is an object, merge properties
                    if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
                        extended[prop] = extend( true, extended[prop], obj[prop] );
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };

        // Loop through each object and conduct a merge
        for ( ; i < length; i++ ) {
            var obj = arguments[i];
            merge(obj);
        }

        return extended;

    };

    /**
  	 * Format file size for display
  	 * @private
  	 * @param  {Int}     bytes    Bytes to format
  	 * @return {String}           The formatted file size
  	 */
    var bytesToSize = function (bytes) {

       var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
       if (bytes == 0) return '0 Byte';
       var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

       return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];

    };

    /**
  	 * Get the closest matching element up the DOM tree.
  	 * @private
  	 * @param  {Element} elem     Starting element
  	 * @param  {String}  selector Selector to match against
  	 * @return {Boolean|Element}  Returns null if not match found
  	 */
  	var getClosest = function ( elem, selector ) {
  		for ( ; elem && elem !== document; elem = elem.parentNode ) {
  			if ( elem.matches( selector ) ) return elem;
  		}
  		return null;
  	};


    /**
  	 * Get file extension from string using regex
  	 * @private
  	 * @param  {String}  filename  String of filename to extract file extension
  	 * @return {String}            Returns null if no extension found
  	 */
  	var getExtension = function ( filename ) {

  		var regex = /(?:\.([^.]+))?$/;
      var extension = regex.exec(filename)[1];

      if( extension != undefined && extension != null){
        extension = extension.toString().toLowerCase();
      }else{
        extension = null;
      }

  		return extension;
  	};

    /**
  	 * List all the files selected
  	 * @private
  	 */
    var displayFiles = function () {

        var fileTable = document.querySelector("#selectedFiles-container");
        var fileTableBody = document.querySelector("#selectedFiles");

        fileTableBody.innerHTML = "";

        //Show or hide table based on filesArr
        if( filesArray.length < 1 ){
          fileTable.style.display = "none";
        }else{
          fileTable.style.display = "block";
        }

        //Loop through all the files
        for( var i=0; i < filesArray.length; i++ ){

          var img;
          if(filesArray[i].thumbnail != null){
            img = "<img src='" + filesArray[i].thumbnail + "' />";
          }else{
            img = '<span class="fa fa-file-o" style="font-size:50px"></span>';
          }

          var html = "<tr>";
            html += "<td>"+img+"</td>";
            html += "<td>" + filesArray[i].filename + "</td>";
            html += "<td>" + filesArray[i].filesizeString + "</td>";
          html += "</tr>";
          fileTableBody.innerHTML += html;

        }

    };


    /**
  	 * Method to get an array of the files for displaying
  	 * @private
  	 * @param  {Event}     e    The change event
  	 */
    var getFilesArray = function(e, callback){

      // Only run on inputs flagged for displaying
      if ( !e.target.matches(settings.selector)) return;

      //Check to see if FileReader is available,
      //Stop if it is not available
      if ( !window.FileReader ) return;

      var files = e.target.files;
      var filesArr = Array.prototype.slice.call(files);
      var increment = 0;

      //Loop through all the files
      filesArr.forEach(function(f) {

        var ext = getExtension(f.name);
        var thumbnail;
        var displayObject = new Object();
        var reader = new FileReader();

        reader.onload = function (e) {

          //Let's check if this MIME type is an image
          if(!f.type.match("image.*")) {
            displayObject.thumbnail = null;
          }else{
            //But we really only want jpg/png/gif
            if( ext == 'jpg' || ext == 'jpeg' || ext == 'png' || ext == 'gif' ){
              displayObject.thumbnail = e.target.result;
            }else{
              displayObject.thumbnail = null;
            }
          }

          displayObject.filesize = f.size;
          displayObject.filesizeString = bytesToSize(f.size);
          displayObject.filename = f.name;
          displayObject.extension = ext;

        }

        reader.readAsDataURL(f);

        //Push displayObject to filesArray
        reader.onloadend = function(){

          //Increment the incrment variable
          increment++;

          if( increment == filesArr.length ){
            callback(displayObject, 1);
          }else{
            callback(displayObject, 0);
          }

          //TO DO: add functionality to add rows to the display fileTable
          //As they're being read

        }

      });

    }

    /**
     * Another public method
     */
    publicMethods.init = function ( options ) {

        // Merge user options with defaults
        settings = extend( defaults, options || {} );

        //Add an event listener for all input changes
        document.addEventListener( 'change', function(e){ getFilesArray(e, pushToFilesArray) }, false);

        //Callback function for change event
        var pushToFilesArray = function(displayObject, last){
          filesArray.push(displayObject);

          //If this is the last item, do your thang
          if(last == 1){

            //Do something based on the output in settings
            switch(settings.output){

              case 'object':
              default:

                return filesArray;
                break;

              case 'bootstrapTable':

                displayFiles();
                break;

            }



          }
        }

    };


    //
    // Public APIs
    //

    return publicMethods;

});
