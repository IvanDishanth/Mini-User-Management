const userList = document.getElementById('user-list');
const addUserForm = document.getElementById('add-user-form');
let users = [];

function renderUsers() {
    userList.innerHTML = '';
    users.forEach((user, index) => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.innerHTML = `
            <img src="${user.picture}" width="50" height="50">
            <div class="user-info">
                <strong>${user.name}</strong><br>
                ${user.email}<br>
                ${user.location}
            </div>
            <button class="delete-btn" onclick="deleteUser(${index})">Delete</button>
        `;
        userList.appendChild(userCard);
    });
}

function deleteUser(index) {
    users.splice(index, 1);
    localStorage.setItem('manualUsers', JSON.stringify(users.filter(u => u.manual)));
    renderUsers();
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isDuplicateEmail(email) {
    return users.some(user => user.email === email);
}

addUserForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const location = document.getElementById('location').value.trim();
    const image = document.getElementById('image').value.trim();

    if (!name || !email || !location || !image) {
        alert('Please fill in all fields.');
        return;
    }

    if (!isValidEmail(email)) {
        alert('Invalid email format.');
        return;
    }

    if (isDuplicateEmail(email)) {
        alert('Email already exists.');
        return;
    }

    const newUser = { name, email, location, picture: image, manual: true };
    users.push(newUser);
    localStorage.setItem('manualUsers', JSON.stringify(users.filter(u => u.manual)));
    renderUsers();
    addUserForm.reset();
});

async function fetchUsers() {
    const response = await fetch('https://randomuser.me/api/?results=5');
    const data = await response.json();
    return data.results.map(user => ({
        name: `${user.name.first} ${user.name.last}`,
        email: user.email,
        location: `${user.location.city}, ${user.location.country}`,
        picture: user.picture.medium,
        manual: false
    }));
}

async function initializeApp() {
    const storedUsers = JSON.parse(localStorage.getItem('manualUsers')) || [];
    const fetchedUsers = await fetchUsers();
    users = [...fetchedUsers, ...storedUsers];
    renderUsers();
}

initializeApp();