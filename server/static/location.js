function get_location() {
    str = $.ajax({
	url: '/output/location',
	type: 'GET',
	data: JSON.stringify(digraph.matrix),
	contentType: 'application/json; charset=utf-8',
	dataType: 'json',
	async: false,
	success: function() {
	}
    });
    console.log(str);
    //document.ElementById("location").innterHTML(

}