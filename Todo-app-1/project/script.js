document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const itemsLeft = document.getElementById('items-left');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const clearCompletedBtn = document.getElementById('clear-completed');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';

    // Initial render
    renderTodos();
    updateItemsLeft();

    // Add new todo
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const todoText = todoInput.value.trim();

        if (todoText) {
            const newTodo = {
                id: Date.now(),
                text: todoText,
                completed: false
            };

            todos.unshift(newTodo);
            saveTodos();
            renderTodos();
            updateItemsLeft();
            todoInput.value = '';
        }
    });

    // Toggle todo completion
    todoList.addEventListener('click', (e) => {
        if (e.target.type === 'checkbox') {
            const todoId = parseInt(e.target.dataset.id);
            toggleTodoComplete(todoId);
        }

        if (e.target.classList.contains('delete-btn')) {
            const todoId = parseInt(e.target.dataset.id);
            deleteTodo(todoId);
        }
    });

    // Filter todos
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentFilter = button.dataset.filter;
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderTodos();
        });
    });

    // Clear completed todos
    clearCompletedBtn.addEventListener('click', () => {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        renderTodos();
        updateItemsLeft();
    });

    function toggleTodoComplete(id) {
        todos = todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, completed: !todo.completed };
            }
            return todo;
        });
        saveTodos();
        renderTodos();
        updateItemsLeft();
    }

    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos();
        updateItemsLeft();
    }

    function renderTodos() {
        const filteredTodos = filterTodos();
        todoList.innerHTML = filteredTodos.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''}">
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''} 
                    data-id="${todo.id}"
                >
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                <button class="delete-btn" data-id="${todo.id}">Delete</button>
            </li>
        `).join('');
    }

    function filterTodos() {
        switch (currentFilter) {
            case 'active':
                return todos.filter(todo => !todo.completed);
            case 'completed':
                return todos.filter(todo => todo.completed);
            default:
                return todos;
        }
    }

    function updateItemsLeft() {
        const activeCount = todos.filter(todo => !todo.completed).length;
        itemsLeft.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;
    }

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});