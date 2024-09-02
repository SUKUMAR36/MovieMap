document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const authSection = document.getElementById('auth-section');
    const managementSection = document.getElementById('management-section');
    const shotlistSection = document.getElementById('shotlist-section');

    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const guestBtn = document.getElementById('guest-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const logoutBtnShotlist = document.getElementById('logout-btn-shotlist');

    const newShotlistBtn = document.getElementById('new-shotlist-btn');
    const editShotlistBtn = document.getElementById('edit-shotlist-btn');
    const toggleShotlistBtn = document.getElementById('toggle-shotlist-btn');
    const backToManagementBtn = document.getElementById('back-to-management-btn');

    const addShotBtn = document.getElementById('add-shot');
    const saveShotlistBtn = document.getElementById('save-shotlist-btn');
    const savePdfBtn = document.getElementById('save-pdf');

    const savedShotlistsDiv = document.getElementById('saved-shotlists');
    const shotlistNamesUl = document.getElementById('shotlist-names');

    let currentUser = null;
    let currentShotlistName = null;

    // Helper Functions
    function showSection(section) {
        authSection.style.display = 'none';
        managementSection.style.display = 'none';
        shotlistSection.style.display = 'none';
        savedShotlistsDiv.style.display = 'none';

        section.style.display = 'block';
    }

    function getUsers() {
        return JSON.parse(localStorage.getItem('users') || '{}');
    }

    function setUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    function getShotlists(user) {
        if (!user) return {};
        return JSON.parse(localStorage.getItem(`shotlists_${user}`) || '{}');
    }

    function setShotlists(user, shotlists) {
        localStorage.setItem(`shotlists_${user}`, JSON.stringify(shotlists));
    }

    function loadShotlist(shotlistName) {
        currentShotlistName = shotlistName || prompt('Enter a name for your shot list:');
        if (!currentShotlistName) return;

        document.getElementById('shotlist-title').textContent = `Movie Map - Shot List: ${currentShotlistName}`;
        const shotlistData = getShotlists(currentUser)[currentShotlistName] || [];

        const tableBody = document.getElementById('shot-list-table').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = ''; // Clear existing content

        shotlistData.forEach(rowData => {
            const row = tableBody.insertRow();
            rowData.forEach(value => {
                const cell = row.insertCell();
                cell.textContent = value;
            });

            // Add delete button
            const deleteCell = row.insertCell();
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => {
                tableBody.deleteRow(row.rowIndex - 1);
                saveShotlist();
            });
            deleteCell.appendChild(deleteBtn);
        });

        showSection(shotlistSection);
    }

    function saveShotlist() {
        if (!currentShotlistName) {
            currentShotlistName = prompt('Enter a name for your shot list:');
            if (!currentShotlistName) return;
        }

        const tableBody = document.getElementById('shot-list-table').getElementsByTagName('tbody')[0];
        const rows = Array.from(tableBody.rows).map(row => Array.from(row.cells).slice(0, 11).map(cell => cell.textContent));

        const shotlists = getShotlists(currentUser);
        shotlists[currentShotlistName] = rows;
        setShotlists(currentUser, shotlists);

        alert('Shot list saved!');
    }

    function showSavedShotlists() {
        const shotlists = getShotlists(currentUser);
        shotlistNamesUl.innerHTML = '';

        Object.keys(shotlists).forEach(name => {
            const li = document.createElement('li');
            li.textContent = name;
            li.addEventListener('click', () => loadShotlist(name));
            shotlistNamesUl.appendChild(li);
        });

        savedShotlistsDiv.style.display = savedShotlistsDiv.style.display === 'block' ? 'none' : 'block';
    }

    // Authentication and User Management
    loginBtn.addEventListener('click', () => {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        const users = getUsers();
        if (users[username] && users[username] === password) {
            currentUser = username;
            showSection(managementSection);
        } else {
            alert('Invalid credentials.');
        }
    });

    registerBtn.addEventListener('click', () => {
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;

        if (username && password) {
            const users = getUsers();
            if (users[username]) {
                alert('Username already exists.');
            } else {
                users[username] = password;
                setUsers(users);
                alert('Account created! You can now log in.');
            }
        } else {
            alert('Please fill out both fields.');
        }
    });

    guestBtn.addEventListener('click', () => {
        currentUser = 'guest';
        showSection(managementSection);
    });

    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        showSection(authSection);
    });

    logoutBtnShotlist.addEventListener('click', () => {
        currentUser = null;
        showSection(authSection);
    });

    // Shotlist Management
    newShotlistBtn.addEventListener('click', () => {
        currentShotlistName = prompt('Enter a name for your new shot list:');
        if (currentShotlistName) {
            document.getElementById('shotlist-title').textContent = `Movie Map - Shot List: ${currentShotlistName}`;
            document.getElementById('shot-list-table').getElementsByTagName('tbody')[0].innerHTML = '';
            showSection(shotlistSection);
        }
    });

    editShotlistBtn.addEventListener('click', () => {
        showSavedShotlists();
    });

    toggleShotlistBtn.addEventListener('click', () => {
        showSavedShotlists();
    });

    backToManagementBtn.addEventListener('click', () => {
        showSection(managementSection);
    });

    addShotBtn.addEventListener('click', () => {
        const sceneNumber = document.getElementById('scene-number').value || '';
        const shotNumber = document.getElementById('shot-number').value || '';
        const subject = document.getElementById('subject').value || '';
        const shotSize = document.getElementById('shot-size').value || '';
        const cameraAngle = document.getElementById('camera-angle').value || '';
        const movement = document.getElementById('movement').value || '';
        const equipment = document.getElementById('equipment').value || '';
        const lens = document.getElementById('lens').value || '';
        const sound = document.getElementById('sound').value || '';
        const notes = document.getElementById('notes').value || '';
        const takeNumber = document.getElementById('take-number').value || '';

        const tableBody = document.getElementById('shot-list-table').getElementsByTagName('tbody')[0];
        const row = tableBody.insertRow();

        row.insertCell(0).textContent = sceneNumber;
        row.insertCell(1).textContent = shotNumber;
        row.insertCell(2).textContent = subject;
        row.insertCell(3).textContent = shotSize;
        row.insertCell(4).textContent = cameraAngle;
        row.insertCell(5).textContent = movement;
        row.insertCell(6).textContent = equipment;
        row.insertCell(7).textContent = lens;
        row.insertCell(8).textContent = sound;
        row.insertCell(9).textContent = notes;
        row.insertCell(10).textContent = takeNumber;

        // Add delete button
        const deleteCell = row.insertCell(11);
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            tableBody.deleteRow(row.rowIndex - 1);
            saveShotlist();
        });
        deleteCell.appendChild(deleteBtn);

        saveShotlist();
        document.getElementById('shot-list-form').reset();
    });

    saveShotlistBtn.addEventListener('click', saveShotlist);

    // Export to PDF
    savePdfBtn.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.text("Movie Map - Shot List", 10, 10);

        const table = document.getElementById('shot-list-table');
        const rows = Array.from(table.querySelectorAll('tbody tr'));
        const headers = Array.from(table.querySelectorAll('thead th')).slice(0, 11).map(th => th.textContent);

        doc.autoTable({
            head: [headers],
            body: rows.map(row => Array.from(row.cells).slice(0, 11).map(cell => cell.textContent)),
            startY: 20,
            theme: 'grid',
            styles: {
                fontSize: 10,
                cellPadding: 3,
            },
            headStyles: {
                fillColor: [52, 58, 64],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
            },
        });

        doc.save(`${currentShotlistName || 'shot-list'}.pdf`);
    });

    // Load saved shot list if any
    if (sessionStorage.getItem('loggedInUser')) {
        currentUser = sessionStorage.getItem('loggedInUser');
        showSection(managementSection);
    } else {
        showSection(authSection);
    }
});
