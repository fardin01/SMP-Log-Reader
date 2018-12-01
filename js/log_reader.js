chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.windows.create({
    url: chrome.runtime.getURL("popup.html"),
    type: "popup"
  });
});

$(document).ready(function() {
    $('input[type="file"]').change(function(event) {
        // obtain input element through DOM
        var file = document.getElementById('file').files[0];
        if (file) {
            getAsText(file);
        }

        function getAsText(readFile) {
            var reader = new FileReader();
            // Read file into memory as UTF-16
            reader.readAsText(readFile, "UTF-8");
            // Handle progress, success, and errors
            reader.onprogress = updateProgress;
            reader.onload = loaded;
            reader.onerror = errorHandler;
        }

        function updateProgress(evt) {
            if (evt.lengthComputable) {
                // evt.loaded and evt.total are ProgressEvent properties
                var loaded = (evt.loaded / evt.total);
                if (loaded < 1) {
                    // Increase the prog bar length
                    // style.width = (loaded * 200) + "px";
                }
            }
        }

        function loaded(evt) {
            // Obtain the read file data
            var log = evt.target.result;
            processLog(log);
        }

        function errorHandler(evt) {
            if (evt.target.error.name == "NotReadableError") {
                // The file could not be read
            }
        }

        function processLog(log) {
        	/*
        	var logHeader = log.split("2018").pop()
        	$(".table-header").append(
        	`
        		<tr>
        		<th>${logHeader}</th>
        		</tr>
        	`
        	)
        	*/

        	var uncleanArray = log.split("|");
        	array = cleanUpArray(uncleanArray);
        	var logArray = []
        	$.each(array, function(index ,value) {
        		logArray.push(value.split("#"))
        	})
        	var finalArray = cleanUpArray(logArray)
        	console.log(finalArray)

        	$.each(finalArray, function(index, value) {
        		$(".table-body").append(
	        	`
	        		<tr>
			            <td>${index+1}</td>
			            <td>${value[0]}</td>
			            <td data-log-level=${value[2]}>${value[2]}</td>
			            <td>${value[3]}</td>
			            <td>${value.slice(-1)}</td>
		          	</tr>

		          	<tr id="full-log" class="hidden">
					    <td colspan="5">${value}</td>
				    </tr>
	          	`
	        	)

	        	$('[data-log-level="DEBUG"]').addClass("bg-success");
	        	$('[data-log-level="WARN"]').addClass("bg-warning");
	        	$('[data-log-level="INFO"]').addClass("bg-info");
        	})

        }

        function cleanUpArray(a) {
        	if (Array.isArray(a[0])) {
        		console.log("Array of Array")
        		array = []
			    a.forEach(function(element) {
			    	array.push(cleanUpCallback(element))
			    })
			    return array  
			} else {
				console.log("One Array")
				return cleanUpCallback(a)
			}
        }

        function cleanUpCallback(a) {
        	var logArray = a.filter(function(value, index, arr){
    			return value != "";
			});
			return logArray;
        }
    });
});