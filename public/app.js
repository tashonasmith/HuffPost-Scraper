$(".navbar-nav li").click(function() {
    $(".navbar-nav li").removeClass("active");
    $(this).addClass("active");
});
 


$("#scrape").on("click", function() {
    $.ajax({
        method: "GET",
        url: "/scrape",
    }).done(function(data) {
        console.log(data)
        window.location = "/"
    })
});

$("#save").on("click", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/saved/" + thisId
    }).done(function() {
        window.location = "/"
    })
});

$("#clear").on("click", function() {
    $.ajax({
        method: "DELETE",
        url: "/articles/delete"
    }).done(function() {
        window.location = "/"
    })
})

$("#delete-article").on("click", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "DELETE",
        url: "/articles/delete/" + thisId
    }).done(function() {
        window.location = "/saved"
    })
})

