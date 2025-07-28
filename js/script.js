const tasksForm = document.getElementById("tasks-form");
const titleInput = document.getElementById("title");
const descInput = document.getElementById("Description");
const statusSelect = document.getElementById("status");
const addBtn = document.getElementById("addBtn");
const newTask = document.getElementById("newTask");
const tasktitle = document.getElementById("task-title");
const todoContainer = document.getElementById("toDo");
const progressContainer = document.getElementById("Inprogress");
const completedContainer = document.getElementById("Completed");
const todoCount = document.getElementById("todoCount");
const progressCount = document.getElementById("progressCount");
const completedCount = document.getElementById("CompletedCount");
const gridBtn = document.getElementById("gridBtn");
const barsBtn = document.getElementById("barsBtn");
const cardContent = document.querySelector(".card-content");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let taskHTML = "";
let updatedIndex;
let draggedTaskIndex = null;
let todoTask = 0,
  progTask = 0,
  compTask = 0;

newTask.addEventListener("click", () => {
  showtasksForm();
});

function showtasksForm() {
  tasksForm.classList.add("d-flex");
  tasksForm.classList.remove("d-none");
  document.body.style.overflow = "hidden";
}

addBtn.addEventListener("click", () => {
  if (addBtn.innerHTML.trim() == "Add Task") {
    const task = {
      status: statusSelect.value,
      title: titleInput.value,
      description: descInput.value,
    };

    tasks.push(task);
    saveTasksToLocal();
    displayTasks(tasks.length - 1);
    resetInputs();
    hidetasksForm();
  } else if (addBtn.innerHTML == "Update Task") {
    updateTask(updatedIndex);
  }
});

tasksForm.addEventListener("click", function (event) {
  if (event.target.id == "tasks-form") {
    hidetasksForm();
  }
});

function hidetasksForm() {
  tasksForm.classList.add("d-none");
  tasksForm.classList.remove("d-flex");
  document.body.style.overflow = "auto";
  addBtn.innerHTML = "Add Task";
  addBtn.classList.replace("btn-update", "btn-new-task");
  resetInputs();
}
function displayAllTasks() {
  resetTasksContainer();
  resetCount();
  for (const [index] of tasks.entries()) {
    displayTasks(index);
  }
}

displayAllTasks();

function displayTasks(index) {
  const task = tasks[index];
  const taskId = `task-${index}`;
  const colorInputId = `color-picker-${index}`;

  taskHTML = `
    <div class="task mb-3 p-3 rounded-1" id="${taskId}" draggable="true"
         ondragstart="dragStart(event, ${index})">
      <h3 class="text-capitalize">${task.title}</h3>
      <p class="description text-capitalize">${task.description}</p>
      <ul class="task-options list-unstyled d-flex gap-3 fs-5 m-0">
        <li><i class="bi bi-pencil-square" onclick="getTaskInfo(${index})"></i></li>
        <li><i class="bi bi-trash-fill" onclick="deleteTask(${index})"></i></li>
        <li>
          <input type="color" class="form-control form-control-color mt-1" id="${colorInputId}" 
            value="#563d7c" title="Choose your color" 
            onchange="changeTaskColor('${taskId}', this.value)">
        </li>     
      </ul>
    </div>
  `;

  setHTML(task.status);
}

function setHTML(status) {
  switch (status) {
    case "toDo":
      todoContainer.innerHTML += taskHTML;
      todoTask++;
      todoCount.innerHTML = todoTask;
      break;
    case "inProgress":
      progressContainer.innerHTML += taskHTML;
      progTask++;
      progressCount.innerHTML = progTask;
      break;
    case "Completed":
      completedContainer.innerHTML += taskHTML;
      compTask++;
      completedCount.innerHTML = compTask;
      break;
  }
}

function changeTaskColor(taskId, color) {
  const task = document.getElementById(taskId);
  if (task) {
    const taskTitle = task.querySelector("h3");
    const taskp = task.querySelector("p");
    const taski = task.querySelectorAll("li i");
    if (taskTitle) {
      taskTitle.style.color = color;
      taskp.style.color = color;
      for (icon of taski) {
        icon.style.color = color;
      }
    }
  }
}

function getTaskInfo(index) {
  showtasksForm();
  const task = tasks[index];
  statusSelect.value = task.status;
  titleInput.value = task.title;
  descInput.value = task.description;

  addBtn.innerHTML = "Update Task";
  addBtn.classList.replace("btn-new-task", "btn-update");
  updatedIndex = index;
}

function updateTask(index) {
  tasks[index].status = statusSelect.value;
  tasks[index].title = titleInput.value;
  tasks[index].description = descInput.value;
  saveTasksToLocal();
  displayAllTasks();
  resetInputs();

  addBtn.innerHTML = "Add Task";
  addBtn.classList.replace("btn-update", "btn-new-task");
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasksToLocal();
  displayAllTasks();
}

function dragStart(event, index) {
  draggedTaskIndex = index;
}


[todoContainer, progressContainer, completedContainer].forEach((container) => {
  container.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  container.addEventListener("dragenter", (e) => {
    container.classList.add("dropdrag-hover");
  });
  container.addEventListener("dragleave", (e) => {
    container.classList.remove("dropdrag-hover");
  });
  container.addEventListener("drop", (e) => {
    e.preventDefault();
    container.classList.remove("dropdrag-hover");

    if (draggedTaskIndex !== null) {
      let newStatus;
      if (container.id === "toDo") newStatus = "toDo";
      else if (container.id === "Inprogress") newStatus = "inProgress";
      else if (container.id === "Completed") newStatus = "Completed";

      tasks[draggedTaskIndex].status = newStatus;
      saveTasksToLocal();
      displayAllTasks();
      draggedTaskIndex = null;
    }
  });
});

function saveTasksToLocal() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function resetInputs() {
  titleInput.value = "";
  descInput.value = "";
  statusSelect.value = "Select Task Status";
}

function resetTasksContainer() {
  todoContainer.innerHTML = "";
  progressContainer.innerHTML = "";
  completedContainer.innerHTML = "";
}

function resetCount() {
  todoTask = 0;
  progTask = 0;
  compTask = 0;
  todoCount.textContent = 0;
  progressCount.textContent = 0;
  completedCount.textContent = 0;
}
