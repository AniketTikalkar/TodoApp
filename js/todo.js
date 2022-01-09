var addToList = () => {
    var titleText = document.getElementById("title").value;
    var descrText = document.getElementById("descr").value;
    var dateText = document.getElementById("dueDate").value;
    var result = validateTaskFields(titleText, descrText, dateText);
    //if both title and descr are empty then alert

    if (result == 1) {
        createList(titleText, descrText, dateText);
        //clear values after adding them
        updateValue(document.getElementById("title"), null);
        updateValue(document.getElementById("descr"), null);
        updateValue(document.getElementById("dueDate"), null);
    }
}

var validateTaskFields = (title, descr, date) => {
    var taskDate = new Date(date);
    var currDate = new Date();
    var emptyStr = '';
    var milSecInADay = 86399099;
    //taskDate will be based on date, so its time will ne 00:00:00 , but task can be done till that days end
    var timeDiff = (taskDate.getTime() + milSecInADay) - currDate.getTime();
    var val = 1;
    if (timeDiff < 0) {
        alert('Due Date for Task is in the past!', 'warning', 'liveAlertPlaceholderDatePick');
        val = 0;
    }
    if (activeTasks.has(title)) {
        alert('Duplicate task, this task has already been added', 'warning', 'liveAlertPlaceholderListAdd');
        val = 0;
    }
    if (title.localeCompare(emptyStr) == 0 && descr.localeCompare(emptyStr) == 0) {
        alert('Both Title and Description are empty', 'warning', 'liveAlertPlaceholderListAdd');
        val = 0;
    }
    else if (title.localeCompare(emptyStr) == 0) {
        alert('Title is empty', 'warning', 'liveAlertPlaceholderListAdd');
        val = 0;
    }

    return val;
}
var deleteTask = (taskId) => {
    var taskToDelete = document.getElementById("taskTable").rows[taskId].cells[1].innerText;
    //delete as this is no longer an active task
    activeTasks.delete(taskToDelete);
    document.getElementById("taskTable").deleteRow(taskId);
    //update serial number for rest of the rows after deletion
    var numberOfRows = document.getElementById("taskTable").rows.length;
    for (var i = taskId; i < numberOfRows; i++) {

        document.getElementById("taskTable").rows[i].cells[0].innerText = i;
        //update delete onclick on the button
        document.getElementById("taskTable").rows[i].cells[4].innerHTML = `<button class="btn btn-sm btn-primary" onclick="deleteTask(${i})">Delete</button>`;
    }
}
//when the refresh is hit, this will get the pending tasks and notify if the dueDate is near
var notifyDueDate = (delay) => {
    var table = document.getElementById("taskTable");
    var currDate = new Date();
    // console.log("Current time is: " + currDate.toLocaleTimeString());
    for (var i = 1; i < table.rows.length; i++) {
        var taskDate = new Date(table.rows[i].cells[3].innerText);
        var task = table.rows[i].cells[1].innerText;
        var Difference_In_Time = taskDate.getTime() - currDate.getTime();
        console.log(task);
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        if (Difference_In_Days <= delay) {
            console.log("reminding for :" + task);
            remindDeadLine(task, taskDate.toLocaleDateString());

        }
    }

}

var remindDeadLine = (task, duedate) => {

    var reminderList = document.getElementById("reminderList");
    var reminderText = `${task} to be done by ${duedate}`;
    var existingReminders = reminderList.innerHTML;
    var newReminder = `<li><a class="dropdown-item" href="#">${reminderText}</a></li>`;
    //if user is notified, then dont notify again
    if (activeTasks.has(task) && !activeTasks.get(task)) {
        //this means user has not been notified
        reminderList.innerHTML = existingReminders + newReminder;
        updateNotificationCounter();
        activeTasks.set(task, true);
    }

}
var clearNotification = () => {
    document.getElementById("reminderCount").innerText = null;
}
var updateNotificationCounter = () => {
    var reminderCnt = document.getElementById("reminderCount");
    var existingCnt = reminderCnt.innerText;
    if (existingCnt === '') {
        reminderCnt.innerText = '1';
    }
    else {
        reminderCnt.innerText = parseInt(existingCnt) + 1;
    }

}
var updateValue = (element, value) => {
    element.value = value;
}
var alert = (message, type, alertId) => {
    var alertPlaceholder = document.getElementById(alertId);
    var wrapper = document.createElement('div');
    wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
    alertPlaceholder.append(wrapper);
}
var createList = (task, description, duedate) => {
    clearSampleRow();
    var index = document.getElementById("taskTable").rows.length;
    var table = document.getElementById("taskTable");
    //store in local to display history
    var taskData = Array.of(description, duedate);
    localStorage.setItem(task, JSON.stringify(taskData));
    activeTasks.set(task, false);
    var existingTable = table.innerHTML;
    var newRow = `  <tr>
        <th scope="row" id="taskCnt">${index}</th>
        <td>${task}</td>
        <td>${description}</td>
        <td>${duedate}</td>
        <td><button class="btn btn-sm btn-primary" onclick="deleteTask(${index})">Delete</button></td>
    </tr>`;
    table.innerHTML = existingTable + newRow;

}
var clearSampleRow = () => {
    if (document.getElementById("taskTable").rows.length <= 1) {
        return;
    }
    var firstRow = document.getElementById("taskTable").rows[1];
    if (firstRow.cells[1].innerHTML === 'Sample Task') {
        document.getElementById("taskTable").deleteRow(1);
    }
}
var hideElem = (elemId) => {
    var x = document.getElementById(elemId);
    if (x.style.display === "none") {
        //do nothing since its already hidden
    } else {
        x.style.display = "none";
    }
}

var showElem = (elemId) => {
    var x = document.getElementById(elemId);
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        //do nothing since its already visible
    }
}
//delete rows except header row
var deleteRows = (elem) => {
    var numRows = elem.rows.length;
    while (numRows > 1) {
        elem.deleteRow(1);
        numRows--;
    }

}
var createHistoryTable = () => {
    var table = document.getElementById("histTable");
    //delete any previous rows since we will print from localstorage
    deleteRows(table);
    var counter = 1;
    for (task in localStorage) {
        if (localStorage.getItem(task) != null && localStorage.getItem(task) != undefined) {
            var row = table.insertRow(counter);
            var numCell = row.insertCell(0);
            var taskCell = row.insertCell(1);
            var descrCell = row.insertCell(2);
            var dateCell = row.insertCell(3);

            // Add  text to the new cells:
            numCell.innerHTML = counter;
            taskCell.innerHTML = task;
            descrCell.innerHTML = JSON.parse(localStorage.getItem(task))[0];
            dateCell.innerHTML = JSON.parse(localStorage.getItem(task))[1];
            counter++;
        }

    }
    showElem("showHistory");
}
var clearReminders = () => {
    var reminderList = document.getElementById("reminderList");
    reminderList.innerHTML = null;
}
var clearStorage = () => {
    localStorage.clear();
    //delete any history table created as well
    var table = document.getElementById("histTable");
    deleteRows(table);
}
var add = document.getElementById('listAdd1');
add.addEventListener('click', addToList);
var notifClear = document.getElementById('navbarDropdown');
notifClear.addEventListener('click', clearNotification);

//this will ensure we notify only once
// var interval = setInterval((() => {
//     var isNotifSent = notifyDueDate(1);
//     if (isNotifSent) {
//         console.log("notification sent");
//         clearInterval(interval);
//     }

// }), 1000);

setInterval((() => {
    console.log("INITIATING");

    notifyDueDate(1);

}), 3000);

const activeTasks = new Map();
