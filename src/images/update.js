function homePage() {
    let homepage = document.getElementById('homepage');

    if (localStorage.getItem('userRole') == 'user') {
        homepage.href = '../index.html';
    }
    else {
        homepage.href = '../dashboard.html';
    }
}

homePage();

function getTask() {
    let taskList = JSON.parse(localStorage.getItem("taskList")) || [];

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const taskId = urlParams.get('taskId');

    taskList = taskList.filter(task => task.id === Number(taskId));

    console.log(taskId);
    return taskList[0];
}

function fillValues(object) {
    // Getting the Primary details
    let todoName = document.getElementById('todo-name');
    let description = document.getElementById('todo-description');
    let startDate = document.getElementById('start-date');
    let dueDate = document.getElementById('due-date');

    //Getting the Secondary details
    let email_input = document.getElementById('email-input');
    let boxColor = document.getElementById('box-color');
    let taskProgress = document.getElementById('task-progress');

    // Getting the Additional details
    let mobileNumber = document.getElementById('mobile-number');
    let relatedLink = document.getElementById('related-link');

    todoName.value = object['name'];
    description.value = object['description'];
    startDate.value = object['startDate'];
    dueDate.value = object['dueDate'];
    email_input.value = object['email'];
    boxColor.value = object['boxColor'];
    taskProgress.value = object['taskProgress'];
    mobileNumber.value = object['mobileNumber'];
    relatedLink.value = object['relatedLink'];

    if (object['notificationMethod'].includes("Email")) {
        document.getElementById('email-notification').checked = true;
    }
    if (object['notificationMethod'].includes("SMS")) {
        document.getElementById('sms-notification').checked = true;
    }

    if (object['priority'] === "High") {
        document.getElementById('high-priority').checked = true;
    } else if (object['priority'] === "Medium") {
        document.getElementById('medium-priority').checked = true;
    } else {
        document.getElementById('low-priority').checked = true;
    }
}

// Fetching the task form local Storage
let object = getTask();
console.log(object);

fillValues(object);

function getSession() {
    const username = localStorage.getItem('authToken');
    return username;
}

function arraysEqual(a, b) {
    if (a === b) return true;
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a.every((value, index) => value === b[index]);
}

function updated(object, NewName, NewDescription, NewStartDate, NewdueDate, NewEmail, NewMobileNumber, NewRelatedLink, NewTaskProgress, NewPriority, NewNotificationMethod, NewboxColor) {
    return (
        object.name !== NewName ||
        object.description !== NewDescription ||
        object.startDate !== NewStartDate ||
        object.dueDate !== NewdueDate ||
        object.email !== NewEmail ||
        object.mobileNumber !== NewMobileNumber ||
        object.relatedLink !== NewRelatedLink ||
        object.taskProgress !== NewTaskProgress ||
        object.priority !== NewPriority ||
        object.boxColor !== NewboxColor ||
        !arraysEqual(object.notificationMethod || [], NewNotificationMethod || [])
    );
}

// For Writing to Local Storage
function writeToLocalStorage(Task) {
    let taskList = JSON.parse(localStorage.getItem("taskList")) || [];
    taskList = taskList.filter(task => task.id !== Task.id);
    let author = getSession();
    Task['author'] = author;
    taskList.push(Task);
    localStorage.removeItem('taskList');
    localStorage.setItem('taskList', JSON.stringify(taskList));
}

function getPriority() {
    if (document.getElementById('high-priority').checked) {
        return "High";
    } else if (document.getElementById('medium-priority').checked) {
        return "Medium";
    } else {
        return "Low";
    }
}

function validateInput() {
    if (document.getElementById('todo-name').value == "" || document.getElementById('start-date').value == "" || document.getElementById('due-date').value == "") {
        alert("Please fill in all required fields.");
        return false;
    }
    return true;
}

function validateDate() {
    const startDate = new Date(document.getElementById('start-date').value);
    const dueDate = new Date(document.getElementById('due-date').value);

    if (startDate > dueDate) {
        alert("Start date cannot be later than due date.");
        return false;
    }
    return true;
}

function getNotificationMethod() {
    let notificationMethod = [];

    if (document.getElementById('email-notification').checked) {
        notificationMethod.push("Email");
    }
    if (document.getElementById('sms-notification').checked) {
        notificationMethod.push("SMS");
    }
    return notificationMethod;
}

document.getElementById('task-progress').addEventListener('input', () => {
    let val = document.getElementById('slider-output');
    val.textContent = "";
    let slider_input = document.getElementById('task-progress').value;
    val.textContent = slider_input + "%";
});

document.getElementById('submit').addEventListener('click', (e) => {
    e.preventDefault();

    let NewtodoName = document.getElementById('todo-name').value;
    let Newdescription = document.getElementById('todo-description').value;
    let NewstartDate = document.getElementById('start-date').value;
    let NewdueDate = document.getElementById('due-date').value;
    let Newemail_input = document.getElementById('email-input').value;
    let NewmobileNumber = document.getElementById('mobile-number').value;
    let NewrelatedLink = document.getElementById('related-link').value;
    let NewtaskProgress = document.getElementById('task-progress').value;
    let Newpriority = getPriority();
    let NewnotificationMethod = getNotificationMethod();
    let NewboxColor = document.getElementById('box-color').value;

    let error = false;
    if (!validateInput()) {
        return;
    }

    if (!validateDate()) {
        return;
    }

    if (!updated(object, NewtodoName, Newdescription, NewstartDate, NewdueDate, Newemail_input, NewmobileNumber, NewrelatedLink, NewtaskProgress, Newpriority, NewnotificationMethod, NewboxColor)) {
        error = true;
    } else {
        let Task = {
            id: object['id'],
            name: NewtodoName,
            description: Newdescription,
            startDate: NewstartDate,
            dueDate: NewdueDate,
            email: Newemail_input,
            mobileNumber: NewmobileNumber,
            relatedLink: NewrelatedLink,
            priority: Newpriority,
            notificationMethod: NewnotificationMethod,
            taskProgress: NewtaskProgress,
            boxColor: NewboxColor
        }
        writeToLocalStorage(Task);

        let successModal = document.getElementById('success');
        successModal.classList.remove('none');
    }

    if (error) {
        alert("No changes were made to the task. Please make some changes to update task");
    } else {
        document.getElementsByClassName("success-card")[0].classList.toggle('none');

        let promise = new Promise(function (resolve, reject) {
            setTimeout(() => resolve("done"), 1000);
        })

        promise.then(
            result => { document.getElementsByClassName("success-card")[0].classList.toggle('none'); }
        )
    }
});

document.getElementById('view-details-btn').addEventListener('click', () => {
    window.location.href = `../details.html?taskId=${object['id']}`;
});

document.getElementById('go-back-btn').addEventListener('click', () => {
    if (localStorage.getItem('userRole') == 'user') {
        window.location.href = '../index.html';
    }
    else {
        window.location.href = '../dashboard.html';
    }
});