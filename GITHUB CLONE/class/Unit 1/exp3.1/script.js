$(document).ready(function () {
    $.getJSON("data.json", function (data) {
        console.log(data);
        if (data.length > 0) {
            $("#placeholder").html(data[0].name);
        } else {
            $("#placeholder").html("No data found.");
        }
    }).fail(function () {
        $("#placeholder").html("Failed to load data.");
    });
});

// Alternative code to load text data from data.txt
 $(document).ready(function () {
    $.get("data.txt", function (data) {
        console.log(data);
        $("#placeholder").html(data);
    }).fail(function () {
        $("#placeholder").html("Failed to load text data.");
    });
});
