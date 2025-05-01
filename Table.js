function submitRegistration() {
  const username = document.getElementById('regUsername').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;

  axios.post('http://localhost:7000/auth/register', {
    username,
    email,
    password
  })
  .then(response => {
    alert('User registered successfully!');
    window.location.href = 'Table.html'; // Go to login page
  })
  .catch(error => {
    console.error('POST error:', error);
    alert('Registration failed. Please try again.');
  });
}

function renderUsers(users) {
    const tableBody = document.getElementById('userTableBody');
    tableBody.innerHTML = ''; // clear previous content
  
    users.map(user => {
      const row = document.createElement('div');
      row.className = 'table-row';
  
      row.innerHTML = `
        <div class="table-cell cell-username">
          <input type="checkbox">
          <img src="4K WALLPAPER FOR DESKTOP.jpeg" class="avatar" />
          <div class="user-info">
            <strong>${user.username}</strong>
            <span>${user.email}</span>
          </div>
        </div>
        <div class="table-cell cell-access">
          <span class="tag green">Admin</span>
          <span class="tag blue">Data Export</span>
          <span class="tag purple">Data Import</span>
        </div>
        <div class="table-cell cell-last">${user.lastActive || 'N/A'}</div>
        <div class="table-cell cell-date">${user.dateAdded || 'N/A'}</div>
        <div class="table-cell cell-options">
          <div class="dots_menu">
            <button class="dots-btn"><i class="fa-solid fa-ellipsis-vertical"></i></button>
            <div class="dropdown hidden">
              <button onclick="prepareUpdateUser('${user._id}', '${user.username}', '${user.email}')">Update</button>
              <button class="delete-user-btn" data-id="${user._id}" >Delete</button>
            </div>
          </div>
        </div>
      `;
  
      tableBody.appendChild(row);
    });
  }

  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    axios.post('http://localhost:7000/auth/login', {
      email,
      password
    }, {
      withCredentials: true
    })
    .then(() => {
      // Success: Show rest of app
      document.getElementById('loginContainer').style.display = 'none';
      document.getElementById('appContent').style.display = 'block';
      getData(); // Load users after login
    })
    .catch(error => {
      loginError.style.display = 'block';
      console.error('Login failed:', error);
    });
  });

  document.addEventListener('click', function(event) {
    const button = event.target.closest('.dots-btn');
    if (button) {
      const dropdown = button.nextElementSibling;
      dropdown.classList.toggle('hidden');
  
      // Close other open dropdowns
      document.querySelectorAll('.dropdown').forEach(menu => {
        if (menu !== dropdown) menu.classList.add('hidden');
      });
    }

    const deleteBtn = event.target.closest('.delete-user-btn');
    if (deleteBtn) {
      const userId = deleteBtn.getAttribute('data-id');
      deleteUser(userId);
    }
  });
  
  

function createUser() {
  document.getElementById('userModal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('userModal').classList.add('hidden');
}

function submitModalUser() {
  const username = document.getElementById('modalUsername').value;
  const email = document.getElementById('modalEmail').value;
  const password = document.getElementById('modalPassword').value;

  axios.post('http://localhost:7000/auth/register',{

    username,
    email,
    password
  })
  .then(response => {
    alert('user registered successfully!');
    closeModal();
    getData();
  })
  .catch(error => {

    console.log('POST error:', error);
  });
}

function getData() {
  axios.get('http://localhost:7000/users',{
    withCredentials: true
  })
    .then(response => {
      renderUsers(response.data); // dynamically injects users
    })
    .catch(error => {
      console.error('GET error:', error);
    });
}

getData(); 


function deleteUser(id){
  const confirmDelete = confirm("Are you sure you want to delete this user?");
  if (!confirmDelete) return;

  axios.delete(`http://localhost:7000/users/${id}`, {
    withCredentials: true
  })
    .then(response => {
      alert('User deleted successfully!');
      getData();
    })
    .catch(error =>{
      console.error('Deletion error', error);
    });
  }


  let currentUserId = null;

  function createUser() {
    currentUserId = null; 
    document.getElementById('modalTitle').textContent = 'Register new User';
    document.getElementById('userModal').classList.remove('hidden');
    document.getElementById('modalUsername').value = '';
    document.getElementById('modalEmail').value = '';
    document.getElementById('modalPassword').value = '';
  }

  function prepareUpdateUser(id, username, email) {
    currentUserId = id;
    document.getElementById('modalTitle').textContent = 'Update User';
    document.getElementById('modalUsername').value = username;
    document.getElementById('modalEmail').value = email;
    document.getElementById('modalPassword').value = ''; 
    document.getElementById('userModal').classList.remove('hidden');
  }

  function submitModalUser() {
    const username = document.getElementById('modalUsername').value;
    const email = document.getElementById('modalEmail').value;
    const password = document.getElementById('modalPassword').value;
  
    const data = { username, email };
    if (password.trim() !== '') {
      data.password = password;
    }
  
    if (currentUserId) {
      // UPDATE existing user
      axios.patch(`http://localhost:7000/users/${currentUserId}`, data, {
        withCredentials: true
      })
      .then(() => {
        alert('User updated successfully!');
        closeModal();
        getData();
      })
      .catch(error => {
        console.error('Update error:', error);
      });
    } else {
      // CREATE new user
      axios.post('http://localhost:7000/auth/register', data)
      .then(() => {
        alert('User registered successfully!');
        closeModal();
        getData();
      })
      .catch(error => {
        console.log('POST error:', error);
      });
    }
  }

  
  
  

  
  





