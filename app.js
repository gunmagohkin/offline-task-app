// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const statusBar = document.getElementById('status-bar');

// Configure LocalForage
localforage.config({ name: 'offlineTaskDB' });

// --- DATA & UI FUNCTIONS ---

// Fetch tasks from server or local storage
async function loadTasks() {
  try {
    let res = await fetch('/.netlify/functions/tasks');
    let tasks = await res.json();
    await localforage.setItem('tasks', tasks);
  } catch (err) {
    console.log('Offline mode: loading local tasks');
  }
  const tasks = await localforage.getItem('tasks') || [];
  renderTasks(tasks);
}

// Render tasks in UI
function renderTasks(tasks) {
  taskList.innerHTML = '';
  tasks.sort((a, b) => b.id - a.id).forEach(t => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="task-text" onclick="editTask(${t.id})" title="Click to edit">${t.text}</span>
      <div class="task-buttons">
        <button onclick="editTask(${t.id})" class="edit-btn">Edit</button>
        <button onclick="deleteTask(${t.id})" class="delete-btn">Delete</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

// --- CRUD OPERATIONS ---

// Add new task
taskForm.addEventListener('submit', async e => {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  const newTask = { id: Date.now(), text: taskText };

  // Optimistic UI update
  const tasks = await localforage.getItem('tasks') || [];
  tasks.push(newTask);
  await localforage.setItem('tasks', tasks);
  renderTasks(tasks);
  taskInput.value = '';

  try {
    await fetch('/.netlify/functions/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    });
    console.log('Task created on server');
  } catch (err) {
    console.log('Offline: create queued');
    await markTaskForSync(newTask, 'create');
  }
});

// Edit task
async function editTask(id) {
  const tasks = await localforage.getItem('tasks') || [];
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const newText = prompt('Edit task:', task.text);
  if (newText === null || newText.trim() === '') return;

  const updatedTask = { ...task, text: newText.trim() };

  // Optimistic UI update
  const updatedTasks = tasks.map(t => t.id === id ? updatedTask : t);
  await localforage.setItem('tasks', updatedTasks);
  renderTasks(updatedTasks);

  try {
    const response = await fetch(`/.netlify/functions/tasks`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: updatedTask.id, text: updatedTask.text })
    });

    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    console.log('Task updated on server');
  } catch (err) {
    console.log('Offline: edit queued', err.message);
    await markTaskForSync(updatedTask, 'update');
  }
}

// Delete task
async function deleteTask(id) {
  // Optimistic UI update
  let tasks = await localforage.getItem('tasks') || [];
  tasks = tasks.filter(t => t.id !== id);
  await localforage.setItem('tasks', tasks);
  renderTasks(tasks);

  try {
    await fetch(`/.netlify/functions/tasks?id=${id}`, { method: 'DELETE' });
    console.log('Task deleted from server');
  } catch (err) {
    console.log('Offline: delete queued');
    await markTaskForSync({ id }, 'delete');
  }
}

// --- OFFLINE SYNCING ---

// Mark tasks for sync when offline
async function markTaskForSync(task, operation) {
  let pendingSync = await localforage.getItem('pendingSync') || [];

  // ✅ IMPROVED LOGIC: Consolidate 'update' operations
  if (operation === 'update') {
    // Find if an update for this task already exists
    const existingUpdateIndex = pendingSync.findIndex(
      item => item.operation === 'update' && item.task.id === task.id
    );

    if (existingUpdateIndex > -1) {
      // If it exists, replace it with the newer update
      pendingSync[existingUpdateIndex] = { task, operation };
    } else {
      // Otherwise, add it as a new operation
      pendingSync.push({ task, operation });
    }
  } else {
    // For 'create' and 'delete', just add them to the queue
    pendingSync.push({ task, operation });
  }

  await localforage.setItem('pendingSync', pendingSync);
}


// Sync pending operations when back online
async function syncPendingOperations() {
  const pendingSync = await localforage.getItem('pendingSync') || [];
  if (pendingSync.length === 0) return;

  console.log(`Syncing ${pendingSync.length} pending operations...`);
  const failedSyncs = [];

  for (const item of pendingSync) {
    try {
      let response;
      if (item.operation === 'create') {
        response = await fetch('/.netlify/functions/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.task)
        });
      } else if (item.operation === 'update') {
        response = await fetch(`/.netlify/functions/tasks`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.task)
        });
      } else if (item.operation === 'delete') {
        response = await fetch(`/.netlify/functions/tasks?id=${item.task.id}`, {
          method: 'DELETE'
        });
      }
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      console.log(`Synced: ${item.operation} for task ID ${item.task.id}`);
    } catch (err) {
      console.error('Sync failed for:', item, err.message);
      failedSyncs.push(item);
    }
  }

  await localforage.setItem('pendingSync', failedSyncs);
  if (failedSyncs.length > 0) {
    console.log(`${failedSyncs.length} operations failed to sync and remain in queue.`);
  } else {
    console.log('All pending operations synced successfully.');
  }
}

// --- ONLINE/OFFLINE STATUS HANDLING ---

function updateStatus() {
  if (navigator.onLine) {
    statusBar.textContent = '🟢 Online';
    statusBar.className = 'status online';
  } else {
    statusBar.textContent = '🔴 Offline';
    statusBar.className = 'status offline';
  }
}

window.addEventListener('online', async () => {
  console.log('Back online → syncing...');
  updateStatus();
  await syncPendingOperations();
  await loadTasks();
});

window.addEventListener('offline', updateStatus);

// Initialize App
updateStatus();
loadTasks();