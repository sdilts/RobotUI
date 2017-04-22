

test = function() {
    var fish = new Object();
    fish["a"] = new Object();
    fish["a"]["b"] = 10;
    console.log(JSON.stringify(fish));
    $.ajax({
	url: '/input/adjgraph/',
	type: 'POST',
	data: JSON.stringify(fish),
	contentType: 'application/json; charset=utf-8',
	dataType: 'json',
	async: false,
	success: function(msg) {
            alert(msg);
    }
});
}