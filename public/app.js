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

//Only works on article at the top of the list for some reason
$(".save").on("click", function() {
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

//Only works on article at the top of the list for some reason
$(".delete").on("click", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "DELETE",
        url: "/articles/delete/" + thisId
    }).done(function() {
        window.location = "/saved"
    })
})

//Only works on article at the top of the list for some reason
$("#add-comment").on("click", function() {
    $('#modelWindow').modal('show');
})

$("#save-comment").on("click", function() {
    var thisId = $(this).attr("data-id");
    var comment = $("#comment-text").val()
    $.post("/articles/" + thisId, {
        comment: comment
    },
    function() {
        window.location = "/saved"
    })
    console.log(comment)
})