var allTask;
//FORM TaskUI

$(document).ready(function () {
    renderName(localStorage);
    getAllTask();

});

//reder name user
function renderName(param) {
    $('#renderName').html('Hi ' + param.name + ', what are your plans for today?');
}

// get all task
function getAllTask() {
    var settings = {
        "url": "https://api-nodejs-todolist.herokuapp.com/task",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": localStorage.getItem('token'),
            "Content-Type": "application/json"
        },
    };

    $.ajax(settings).done(function (tasks) {
        var data = tasks.data.reverse()
        renderTask(data);
        allTask = data;
    });
}

//render Json >> HTML
function tasksHandler(param) {
    param.createdAt = param.createdAt.slice(0, 16);
    if (param.completed === true) {
        param.completed = "Done! Good job"
        var html = '<table class="done-task" style="width:100%">' +
            '<tr> <td style="width:40%">' + param.description + '</td>' +
            '<td style="width:20%" >' + param.completed + '</td>' +
            '<td style="width:25%">' + param.createdAt + '</td>' +
            '<td style="width:15%">' +
            '<button class = "btn btn-update" type="button" " data-id="' + param._id + '"  data-com="' + param.completed + '">Update</button>' +
            '<button class = "btn btn-danger" type="button" data-id="' + param._id + '">Delete</button>' +
            '</td></tr ></table > ';
    } else {
        param.completed = "Lets do it"
        var html = '<table style="width:100%">' +
            '<tr> <td style="width:40%">' + param.description + '</td>' +
            '<td style="width:20%">' + param.completed + '</td>' +
            '<td style="width:25%">' + param.createdAt + '</td>' +
            '<td style="width:15%">' +
            '<button class = "btn btn-update" type="button" " data-id="' + param._id + '"  data-com="' + param.completed + '">Update</button>' +
            '<button class = "btn btn-danger" type="button" data-id="' + param._id + '">Delete</button>' +
            '</td></tr ></table > ';
    }
    $("#renderTask").append(html);

}
function renderTask(params) {
    $.map(params, tasksHandler);
}
////Search Button Click
$(document).ready(function () {
    $('.btn-search').click(function () {
        searchTask(allTask);
    })
});

function searchTask(params) {
    var searchValue = $('#searchInput').val();
    if (searchValue.length >0) {

        var arr = [];
        params.forEach(element => {
            if (element.description.toString().toLowerCase().includes(searchValue.toString().toLowerCase())) {
                arr.push(element._id);
            }
        });

        // console.log(arr);

        if (arr.length > 0) {
            $('#resultTasks').html(`Found ${arr.length} task!`);
            $("#renderTask").empty();
            allTask = [];

            arr.forEach(element => {
                var settings = {
                    "url": "https://api-nodejs-todolist.herokuapp.com/task/" + element,
                    "method": "GET",
                    "timeout": 0,
                    "headers": {
                        "Authorization": localStorage.getItem('token'),
                        "Content-Type": "application/json"
                    },
                };

                $.ajax(settings).done(function (response) {
                    allTask.push(response.data);
                    $("#renderTask").empty();
                    renderTask(allTask);
                });

            });
        } else {
            alert("Task not found!");
        }
    } else {
        alert("Input is empty!");
    }
}
//Update Task BY ID
$(document).ready(function () {
    $('#renderTask').on('click', '.btn-update', function () {
        var id = $(this).data('id');
        var status = $(this).data('com');
        if (status === "Done! Good job") {
            alert("Your task is done!")
        } else {
            var update = {
                "url": "https://api-nodejs-todolist.herokuapp.com/task/" + id,
                "method": "PUT",
                "timeout": 0,
                "headers": {
                    "Authorization": localStorage.getItem('token'),
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify({ "completed": true }),
            };

            $.ajax(update).done(function (result) {
                if (result.success) {
                    $('#searchInput').val('');
                    $('#resultTasks').empty();
                    $("#renderTask").empty();
                    getAllTask();
                    alert("Update success!");
                }
            });
        }
    });
});

//Delete Task By ID
$(document).ready(function () {
    $('#renderTask').on('click', '.btn-danger', function () {
        var id = $(this).data('id');
        var deltask = {
            "url": "https://api-nodejs-todolist.herokuapp.com/task/" + id,
            "method": "DELETE",
            "timeout": 0,
            "headers": {
                "Authorization": localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
        };

        $.ajax(deltask).done(function (result) {
            if (result.success) {
                $('#searchInput').val('');
                $('#resultTasks').empty();
                $("#renderTask").empty();
                getAllTask();
                alert("Delete success!");
            }
        });
    });
});

//Add task
//Open popup form
$(document).ready(function () {
    //Open popup form
    $('.open-button').click(function () {
        $('#myForm').css('display', 'block');
        $('.mModal').css('display', 'block');
        $('#status').prop('disabled', true);
    })
    //Close popup form
    $('.cancel').click(function () {
        $('#myForm').css('display', 'none');
        $('.mModal').css('display', 'none');
    })
    //Add task with popupForm
    $('.save').click(function () {
        var description = $('#desc').val();
        var add = {
            "url": "https://api-nodejs-todolist.herokuapp.com/task",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Authorization": localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({ "description": description }),
        };

        $.ajax(add).done(function (result) {
            if (result.success) {
                $('#searchInput').val('');
                $('#desc').val('');
                $('#resultTasks').empty();
                $("#renderTask").empty();
                getAllTask();
                alert("Add success!");
            }
        });
    })
});

//LogOut User

$(document).ready(function () {
    $('.btn-logout').click(function () {
        var logout = {
            "url": "https://api-nodejs-todolist.herokuapp.com/user/logout",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Authorization": localStorage.getItem('token'),
            },
        };

        $.ajax(logout).done(function (response) {
            console.log(response);
            window.location.href = 'home.html';
            window.localStorage.clear();
        });
    })

});