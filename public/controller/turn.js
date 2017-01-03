function update(url){
    $.get(url, function(data, status){
        console.log("Data: " + data + "\nStatus: " + status);
        location.reload();
    });
}