// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// DOM Elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const statusBar = document.getElementById('status-bar');

// Modal Elements
const editModal = document.getElementById('edit-modal');
const editInput = document.getElementById('edit-task-input');
const saveEditButton = document.getElementById('save-edit-button');
const closeButton = document.querySelector('.close-button');
let currentEditingTaskId = null;

// Configure LocalForage
localforage.config({ name: 'offlineTaskDB' });

// --- DATA & UI FUNCTIONS ---

async function loadTasks() {
  try {
    const res = await fetch('/.netlify/functions/tasks');
    const tasks = await res.json();
    await localforage.setItem('tasks', tasks);
  } catch (err) {
    console.log('Offline mode: loading local tasks');
  }
  const tasks = await localforage.getItem('tasks') || [];
  renderTasks(tasks);
}

function renderTasks(tasks) {
  taskList.innerHTML = '';
  tasks.sort((a, b) => b.id - a.id).forEach(t => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="task-text" onclick="openEditModal(${t.id})" title="Click to edit">${t.text}</span>
      <div class="task-buttons">
        <button onclick="openEditModal(${t.id})" class="edit-btn">Edit</button>
        <button onclick="deleteTask(${t.id})" class="delete-btn">Delete</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

// --- CRUD OPERATIONS ---

taskForm.addEventListener('submit', async e => {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  const tempId = Date.now();
  const newTask = { id: tempId, text: taskText };

  let tasks = await localforage.getItem('tasks') || [];
  tasks.push(newTask);
  await localforage.setItem('tasks', tasks);
  renderTasks(tasks);
  taskInput.value = '';

  try {
    const response = await fetch('/.netlify/functions/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    });

    if (response..ok) {
      const createdTask = await response.json();
      tasks = await localforage.getItem('tasks') || [];
      const taskIndex = tasks.findIndex(t => t.id === tempId);
      if (taskIndex > -1) {
        tasks[taskIndex].id = createdTask.id;
        await localforage.setItem('tasks', tasks);
      }
      console.log('Task created on server and local ID updated');
    } else {
      throw new Error('Server error on task creation');
    }

  } catch (err) {
    console.log('Offline: create queued');
    await markTaskForSync(newTask, 'create');
  }
});

async function deleteTask(id) {
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

// --- MODAL & EDIT LOGIC ---

async function openEditModal(id) {
  const tasks = await localforage.getItem('tasks') || [];
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  currentEditingTaskId = id;
  editInput.value = task.text;
  editModal.style.display = 'block';
}

function closeEditModal() {
  editModal.style.display = 'none';
  currentEditingTaskId = null;
}

closeButton.onclick = closeEditModal;
window.onclick = (event) => {
  if (event.target == editModal) {
    closeEditModal();
  }
};

saveEditButton.addEventListener('click', async () => {
  const newText = editInput.value.trim();
  if (!newText || !currentEditingTaskId) return;

  const tasks = await localforage.getItem('tasks') || [];
  const task = tasks.find(t => t.id === currentEditingTaskId);
  if (!task) return;

  const updatedTask = { ...task, text: newText };

  const updatedTasks = tasks.map(t => t.id === currentEditingTaskId ? updatedTask : t);
  await localforage.setItem('tasks', updatedTasks);
  renderTasks(updatedTasks);
  closeEditModal();

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
});

// --- OFFLINE SYNCING ---

async function markTaskForSync(task, operation) {
  let pendingSync = await localforage.getItem('pendingSync') || [];

  if (operation === 'update') {
    const existingUpdateIndex = pendingSync.findIndex(
      item => item.operation === 'update' && item.task.id === task.id
    );

    if (existingUpdateIndex > -1) {
      pendingSync[existingUpdateIndex] = { task, operation };
    } else {
      pendingSync.push({ task, operation });
    }
  } else {
    pendingSync.push({ task, operation });
  }

  await localforage.setItem('pendingSync', pendingSync);
}

async function syncPendingOperations() {
  let pendingSync = await localforage.getItem('pendingSync') || [];
  if (pendingSync.length === 0) return;

  console.log(`Syncing ${pendingSync.length} pending operations...`);
  const failedSyncs = [];
  let tasks = await localforage.getItem('tasks') || [];

  for (const item of pendingSync) {
    try {
      let response;
      if (item.operation === 'create') {
        response = await fetch('/.netlify/functions/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.task)
        });

        if (!response.ok) throw new Error('Server returned error on create');
        
        const createdTask = await response.json(); // Task with permanent ID
        const tempId = item.task.id;
        const permanentId = createdTask.id;
        
        // Update the main tasks array in local storage
        const taskIndex = tasks.findIndex(t => t.id === tempId);
        if (taskIndex > -1) {
          tasks[taskIndex].id = permanentId;
        }

        // IMPORTANT: Update any later operations in the queue that refer to this tempId
        pendingSync.forEach(op => {
          if (op.task.id === tempId) {
            op.task.id = permanentId;
          }
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

  await localforage.setItem('tasks', tasks); // Save the updated tasks array
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