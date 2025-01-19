document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('resource-form');
  const list = document.getElementById('resource-list');
  const API_URL = 'http://localhost:3000/resources';

  const fetchResources = async () => {
    try {
      const response = await fetch(API_URL);
      const resources = await response.json();
      list.innerHTML = resources.map(resource => `
        <li class="list-group-item d-flex justify-content-between align-items-center bg-dark text-light">
          <span><strong>${resource.name}</strong>: ${resource.description}</span>
          <div>
            <button class="btn btn-warning btn-sm me-2" onclick="editResource(${resource.id}, '${resource.name}', '${resource.description}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteResource(${resource.id})">Delete</button>
          </div>
        </li>
      `).join('');
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('resource-id').value;
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;

    if (!name || !description) {
      alert('Both name and description are required!');
      return;
    }

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });

      form.reset();
      fetchResources();
    } catch (error) {
      console.error('Error saving resource:', error);
    }
  });

  window.deleteResource = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  window.editResource = (id, name, description) => {
    document.getElementById('resource-id').value = id;
    document.getElementById('name').value = name;
    document.getElementById('description').value = description;
  };

  fetchResources();
});
