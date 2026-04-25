const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Functions
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks(filter='all') {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    if(filter === 'completed' && !task.completed) return;
    if(filter === 'pending' && task.completed) return;

    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    
    li.innerHTML = `
      <span>${task.text} <small>${task.date}</small></span>
      <div class="task-actions">
        <button onclick="toggleTask(${index})">✔</button>
        <button onclick="editTask(${index})">✏️</button>
        <button onclick="deleteTask(${index})">🗑️</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  if(!text) return;

  const date = new Date().toLocaleString();
  tasks.push({ text, completed: false, date });
  saveTasks();
  renderTasks();
  taskInput.value = '';
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const newText = prompt('Edit your task:', tasks[index].text);
  if(newText) {
    tasks[index].text = newText;
    saveTasks();
    renderTasks();
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => { if(e.key === 'Enter') addTask(); });

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter-btn.active').classList.remove('active');
    btn.classList.add('active');
    renderTasks(btn.dataset.filter);
  });
});

// Initial render
renderTasks();

document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', function(e){
    const circle = document.createElement('span');
    circle.classList.add('ripple');
    this.appendChild(circle);

    const d = Math.max(this.clientWidth, this.clientHeight);
    circle.style.width = circle.style.height = d + 'px';
    const rect = this.getBoundingClientRect();
    circle.style.left = e.clientX - rect.left - d/2 + 'px';
    circle.style.top = e.clientY - rect.top - d/2 + 'px';

    circle.classList.add('ripple-animate');
    circle.addEventListener('animationend', () => circle.remove());
  });
});

