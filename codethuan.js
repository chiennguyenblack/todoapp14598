// Đăng nhập và trả về jsonInfo
var html = {};
var tasks = [];


function testFunc() {
    var meo = document.getElementById("meo").value;
    var pass = document.getElementById("pass").value;
    var handle = document.getElementById("handle");

    handle.innerHTML = "Mạng hơi chậm tí..."
    // console.log(meo, pass);
    var obj = {
        "email": meo,
        "password": pass
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify(obj);
    // console.log(raw);
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://api-nodejs-todolist.herokuapp.com/user/login", requestOptions)
        .then(response => response.json())
        .then(function (result) {
            html = result.user;
            //Return UserInfo
            renderInfo(html);
            if (localStorage) {
                console.log("Hỗ trợ localStorage");
                // LocalStorage is supported
                localStorage.setItem('token', result.token);
                localStorage.setItem('name', html.name);
                window.location.href = 'taskui.html';
            } else {
                console.log("Ko hỗ trợ localStorage");
                // No support. Fallback here!
            }
        })
        .catch(error => console.log('error', error));

};
//Render info user
function renderInfo(param) {
}
//TaskUI
// get all task
function loadingUI() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem('token'));
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("https://api-nodejs-todolist.herokuapp.com/task", requestOptions)
        .then(response => response.json())
        .then(function (result) {
            tasks = result.data;
            getName(localStorage);
            renderTask(tasks);

        })
        .catch(error => console.log('error', error));


}


//render Json >> HTML

function getName(param) {
    var renderName = document.getElementById('renderName').innerHTML = 'Hi ' + param.name + ', what are your plans for today?';
}
function tasksHandler(task) {
    if (task.completed === true) {
        task.completed = "Done! Good job"
    } else {
        task.completed = "Lets do it"
    }
    var createdAtUI = task.createdAt.slice(0, 16);
    return `
    <table style="width:100%">
            <tr>
                <td style="width:40%">${task.description}</td>
                <td style="width:20%">${task.completed}</td>
                <td style="width:25%">${createdAtUI}</td>
                <td style="width:15%">
                <button class = "btn btn-update" type="button" onclick="updateTask('${task._id}','${task.completed}')" id="update">Update</button>
                <button class = "btn btn-danger" type="button" onclick="deleteTask('${task._id}')" id="delete">Delete</button>
                </td>
              </tr>
        </table>  
    `;
}
function renderTask(tasks) {
    var taskRender = document.getElementById("renderTask");
    var tasksHtml = tasks.map(tasksHandler);
    taskRender.innerHTML = tasksHtml.join('');
}

//Update Task BY ID

function updateTask(paramID, paramCom) {
    console.log(paramID);
    console.log(paramCom);
    if (paramCom === "Done! Good job") {
        alert("Your task is done!")
    } else {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", localStorage.getItem('token'));
        myHeaders.append("Content-Type", "application/json");
        var upURL = "https://api-nodejs-todolist.herokuapp.com/task/" + paramID;
        console.log(upURL);
        var raw = JSON.stringify({ "completed": true });

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(upURL, requestOptions)
            .then(response => response.text())
            .then(function (result) {
                renderTask(tasks);
                location.reload();
            })
            .catch(error => console.log('error', error));
    }


}

//Delete Task By ID
function deleteTask(param) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem('token'));
    myHeaders.append("Content-Type", "application/json");
    var delURL = "https://api-nodejs-todolist.herokuapp.com/task/" + param;
    console.log(delURL);
    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(delURL, requestOptions)
        .then(response => response.json())
        .then(function (result) {
            renderTask(tasks);
            location.reload();
        })
        .catch(error => console.log('error', error));

}

//Add task 
//Popup Form

function openForm() {
    document.getElementById("myForm").style.display = "block";
    document.getElementById("status").disabled = true;
    // document.getElementById("myModal").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
    // document.getElementById("myModal").style.display = "none";
}
//Add task with popupForm
function addTask() {
    var description = document.getElementById("desc").value;
    var myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem('token'));
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ "description": description });
    console.log(raw);
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://api-nodejs-todolist.herokuapp.com/task", requestOptions)
        .then(response => response.text())
        .then(function (result) {
            renderTask(tasks);
            location.reload();
        })
        .catch(error => console.log('error', error));
}
//LogOut User
function logOut() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem('token'));

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("https://api-nodejs-todolist.herokuapp.com/user/logout", requestOptions)
        .then(response => response.text())
        .then(function (result) {
            window.location.href = 'index.html';
            window.localStorage.clear();
        })
        .catch(error => console.log('error', error));
}