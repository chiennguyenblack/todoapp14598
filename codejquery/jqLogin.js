
// FORM Login and get info
$(document).ready(function () {
    $('#sub').click(function () {
        //get value when click login
        var meo = $('#meo').val();
        var pass = $('#pass').val();
        $('#handle').html("Waiting for network...")
        //
        var settings = {
            "url": "https://api-nodejs-todolist.herokuapp.com/user/login",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({ "email": meo, "password": pass }),
        };

        $.ajax(settings).done(function (response) {

            if (localStorage) {
                console.log("Hỗ trợ localStorage");
                // LocalStorage is supported
                localStorage.setItem('token', response.token);
                localStorage.setItem('name', response.user.name);
                window.location.href = 'taskui.html';
            } else {
                console.log("Ko hỗ trợ localStorage");
                // No support. Fallback here!
            }
        });
    })

});