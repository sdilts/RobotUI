function get_location() {
    str = $.ajax({
	url: '/output/location',
	type: 'GET',
	contentType: 'application/json; charset=utf-8',
	dataType: 'json',
	async: false,
	success: function(msg) {
            alert(msg);
	}
    });
    console.log(str);
    console.log(str["responseText"]);
    document.getElementById("location").innerHTML = str["responseText"]
}

function command_bot() {
    

}