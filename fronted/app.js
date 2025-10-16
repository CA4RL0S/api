document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000/api';

    const sections = {
        profiles: document.getElementById('profiles-section'),
        states: document.getElementById('states-section'),
        categories: document.getElementById('categories-section'),
        users: document.getElementById('users-section'),
        news: document.getElementById('news-section'),
    };

    const forms = {
        profile: document.getElementById('profile-form'),
        state: document.getElementById('state-form'),
        user: document.getElementById('user-form'),
        category: document.getElementById('category-form'),
        new: document.getElementById('new-form'),
    };
    
    const tableBodies = {
        profiles: document.getElementById('profiles-table-body'),
        states: document.getElementById('states-table-body'),
        categories: document.getElementById('categories-table-body'),
        users: document.getElementById('users-table-body'),
        news: document.getElementById('news-table-body'),
    };

    const navLinks = document.querySelectorAll('nav ul li');

    // --- NAVEGACIÓN ---
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const target = link.dataset.target;
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            Object.values(sections).forEach(section => section.classList.add('hidden'));
            sections[target].classList.remove('hidden');

            loadData(target);
        });
    });

    const loadData = async (type) => {
        try {
            const response = await fetch(`${API_URL}/${type}`);
            const data = await response.json();
            renderTable(type, data);
        } catch (error) {
            console.error(`Error al cargar ${type}:`, error);
        }
    };

    const renderTable = (type, data) => {
        const tbody = tableBodies[type];
        tbody.innerHTML = '';
        
        const renderRowFunc = {
            profiles: getProfileRow,
            states: getStateRow,
            categories: getCategoryRow,
            users: getUserRow,
            news: getNewRow,
        }[type];

        data.forEach(item => {
            const tr = renderRowFunc(item);
            tbody.appendChild(tr);
        });
    };

    const createActionsCell = (id, type) => {
        const td = document.createElement('td');
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.className = 'btn btn-warning';
        editButton.onclick = () => handleEdit(id, type);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.className = 'btn btn-danger';
        deleteButton.onclick = () => handleDelete(id, type);
        
        td.append(editButton, deleteButton);
        return td;
    };

    const getProfileRow = (item) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${item._id}</td><td>${item.nombre}</td>`;
        tr.appendChild(createActionsCell(item._id, 'profiles'));
        return tr;
    };
    
    const getStateRow = (item) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${item._id}</td><td>${item.nombre}</td><td>${item.abreviacion}</td>`;
        tr.appendChild(createActionsCell(item._id, 'states'));
        return tr;
    };

    const getCategoryRow = (item) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${item._id}</td><td>${item.nombre}</td><td>${item.descripcion || ''}</td>`;
        tr.appendChild(createActionsCell(item._id, 'categories'));
        return tr;
    };

    const getUserRow = (item) => {
        const tr = document.createElement('tr');
        const profileName = item.perfil_id ? item.perfil_id.nombre : 'N/A';
        tr.innerHTML = `<td>${item.nick}</td><td>${item.nombre} ${item.apellidos}</td><td>${profileName}</td>`;
        tr.appendChild(createActionsCell(item._id, 'users'));
        return tr;
    };

    const getNewRow = (item) => {
        const tr = document.createElement('tr');
        const categoryName = item.categoria_id ? item.categoria_id.nombre : 'N/A';
        const stateName = item.estado_id ? item.estado_id.nombre : 'N/A';
        const userNick = item.usuario_id ? item.usuario_id.nick : 'N/A';
        tr.innerHTML = `<td>${item.titulo}</td><td>${categoryName}</td><td>${stateName}</td><td>${userNick}</td>`;
        tr.appendChild(createActionsCell(item._id, 'news'));
        return tr;
    };

    const handleFormSubmit = async (e, type, endpoint) => {
        e.preventDefault();
        const form = e.target;
        const id = form.querySelector('input[type="hidden"]').value;
        const body = {};

        new FormData(form).forEach((value, key) => {
            const input = form.querySelector(`[id^="${type}-"]#${key.replace('_id','')}`);
            if (input) body[key] = value;
        });
        
        const formElements = form.elements;
        const payload = {};
        for (const element of formElements) {
            if (element.id) {
                const key = element.id.replace(`${type}-`, '');
                 if(key.includes('perfil') || key.includes('categoria') || key.includes('estado') || key.includes('usuario')) {
                    payload[key + '_id'] = element.value;
                 } else if (key !== 'id' && element.type !== 'button' && element.type !== 'submit') {
                    payload[key] = element.value;
                 }
            }
        }
        
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_URL}/${endpoint}/${id}` : `${API_URL}/${endpoint}`;
        
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error('Error en la petición');
            
            form.classList.add('hidden');
            form.reset();
            loadData(endpoint);
        } catch (error) {
            console.error(`Error al guardar ${type}:`, error);
        }
    };
    
    forms.profile.addEventListener('submit', (e) => handleFormSubmit(e, 'profile', 'profiles'));
    forms.state.addEventListener('submit', (e) => handleFormSubmit(e, 'state', 'states'));
    forms.category.addEventListener('submit', (e) => handleFormSubmit(e, 'category', 'categories'));
    forms.user.addEventListener('submit', (e) => handleFormSubmit(e, 'user', 'users'));
    forms.new.addEventListener('submit', (e) => handleFormSubmit(e, 'new', 'news'));

    const handleEdit = async (id, type) => {
        const response = await fetch(`${API_URL}/${type}/${id}`);
        const data = await response.json();
        
        const form = forms[type.slice(0, -1)]; 
        
        for (const key in data) {
            const input = form.querySelector(`#${type.slice(0, -1)}-${key.replace('_id','')}`);
            if (input) {
                if(input.tagName === 'SELECT') {
                     input.value = data[key]._id;
                } else {
                     input.value = data[key];
                }
            }
        }
        form.querySelector('input[type="hidden"]').value = data._id; 
        form.classList.remove('hidden');
    };

    const handleDelete = async (id, type) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este registro?')) return;
        
        try {
            await fetch(`${API_URL}/${type}/${id}`, { method: 'DELETE' });
            loadData(type);
        } catch (error) {
            console.error(`Error al eliminar en ${type}:`, error);
        }
    };
    
    document.querySelectorAll('[id^="btn-new-"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.id.split('-')[2];
            forms[type].reset();
            forms[type].querySelector('input[type="hidden"]').value = '';
            forms[type].classList.remove('hidden');
        });
    });

    document.querySelectorAll('[id^="btn-cancel-"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.id.split('-')[2];
            forms[type].classList.add('hidden');
        });
    });

    const populateSelect = async (selectElement, endpoint, valueField, textField) => {
        try {
            const response = await fetch(`${API_URL}/${endpoint}`);
            const data = await response.json();
            selectElement.innerHTML = '<option value="">Selecciona una opción</option>';
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item[valueField];
                option.textContent = item[textField];
                selectElement.appendChild(option);
            });
        } catch (error) {
            console.error(`Error poblando select para ${endpoint}:`, error);
        }
    };
    
    const initializeApp = () => {
        loadData('profiles');
        populateSelect(document.getElementById('user-perfil'), 'profiles', '_id', 'nombre');
        populateSelect(document.getElementById('new-categoria'), 'categories', '_id', 'nombre');
        populateSelect(document.getElementById('new-estado'), 'states', '_id', 'nombre');
        populateSelect(document.getElementById('new-usuario'), 'users', '_id', 'nick');
    };
    
    initializeApp();
});