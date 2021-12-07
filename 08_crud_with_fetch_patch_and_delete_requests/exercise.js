let todoList
// 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 
// Task 1: add an event listener for DOMContentLoaded that will `fetch` the tasks from the json-server (`http://localhost:3000/tasks`)
//  - store the resulting data in `todoList`
//  - invoke `loadTodoList`, passing `todoList` as an argument
document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:3000/tasks')
    .then((response) => response.json())
    .then(loadTodoList)
})



function loadTodoList(todoList) {
  const target = getTodoListElement();
  todoList.forEach(task => {
    target.append(renderTask(task))
  })
}

function getTodoListElement() {
  return document.querySelector('#todoList')
}

function renderTask(task) {
  const li = document.querySelector(`li.task[data-task-id="${task.id}"]`) || document.createElement('li');
  li.className = 'grid grid-cols-12 items-center task';
  li.dataset.taskId = task.id;
  li.innerHTML = `
  <span class="col-span-6 task-label">

  </span>
  <span class="col-span-5 due-date">

  </span>
  <span class="flex items-center space-x-2 due-date completed">
    
  </span>
  `; 
  const taskLabelEl = li.querySelector('.task-label');
  const dueDateEl = li.querySelector('.due-date');
  const completedEl = li.querySelector('.completed');
  
  taskLabelEl.textContent = task.label;
  dueDateEl.textContent = task.dueDate;
  completedEl.innerHTML = `<i class="toggleComplete far ${task.complete ? 'fa-check-square' : 'fa-square'} text-3xl text-green-300 cursor-pointer"></i>
  <i class="deleteTask fas fa-trash text-2xl object-right-top cursor-pointer"></i>`;

  completedEl.addEventListener('click', (event) => {
    if (event.target.matches('.toggleComplete')) {
      toggleComplete(task);
    } else if (event.target.matches('.deleteTask')) {
      deleteTask(task);
    }
  })

  return li;
}



function addTask(taskLabel, dueDate) {
  const newTask = {
    label: taskLabel,
    dueDate: dueDate,
    completed: false
  }
  // 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 
  // BONUS Task 2: Add fetch request to persist the newTask to the json-server before adding it to the todoList and the DOM
  // 
  // move the lines below inside of the promise callback so that you update the todoList and the DOM after the `newTask` is added to db.json via fetch.
  // You want to make sure that the newly added task has an id as that will be important later on.
  return fetch('http://localhost:3000/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newTask)
  })
    .then(response => response.json())
    .then(savedTask => {
      const target = getTodoListElement();
      target.append(renderTask(savedTask))
      return savedTask
    })
}

function deleteTask(task) {
  const li = document.querySelector(`li.task[data-task-id="${task.id}"]`);
  console.log(li);
  li.remove();
}

function toggleComplete(task) {
  task.complete = !task.complete;
  
  // 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 
  // BONUS Task 3: send a fetch request to update the task in json-server so that the complete status will be persisted to db.json
  // fetch(`http://localhost:3000/tasks/${task.id}`, {
  //   method: 'PATCH',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     complete: task.complete
  //   })
  // })
  //   .then(response => response.json())
  //   .then(updatedTask => {
  //     Object.assign(task, updatedTask);
  //   })
  renderTask(task);
  return task
}

function handleNewTaskSubmit(event) {
  event.preventDefault();
  const label = event.target.labelInput.value;
  const dueDate = event.target.dueDateInput.value;
  addTask(label, dueDate);
  event.target.reset();
}

document.querySelector('form#newTask').addEventListener('submit', handleNewTaskSubmit)
