let usersData = [];

fetch('users.json')
  .then(res => res.json())
  .then(data => { usersData = data.users; })
  .catch(() => console.error('Unable to load user data')); 

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const user = usersData.find(u => u.username === username);
    if (user && user.password === btoa(password)) {
      window.location.href = 'hct/cr/dashboard.html';
    } else {
      alert('Invalid credentials');
    }
  });
});
