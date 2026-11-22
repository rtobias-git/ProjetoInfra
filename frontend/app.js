const API_BASE = '/api';

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-sair').forEach(btn => {
        btn.addEventListener('click', logout);
    });

    const isLoginPage = window.location.pathname.endsWith('login.html');

    if (isLoginPage) {
        const user = localStorage.getItem('bookflow_user');
        if (user) {
            window.location.href = 'index.html';
        }
    } else {
        if (verificarAutenticacao()) {
            carregarCategorias();
            carregarLivros();
        }
    }
});

function verificarAutenticacao() {
    const userJson = localStorage.getItem('bookflow_user');
    const isLoginPage = window.location.pathname.endsWith('login.html');

    if (!userJson && !isLoginPage) {
        window.location.href = 'login.html';
        return false;
    }

    if (userJson) {
        try {
            const user = JSON.parse(userJson);
            const userEmailSpan = document.querySelector('.user-email');
            if (userEmailSpan && user.email) {
                userEmailSpan.innerText = `${user.email} (${user.role || 'USER'})`;
            }
        } catch (e) {
            console.error(e);
        }
    }
    return true;
}

function fazerLogin(event) {
    if (event) event.preventDefault();
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const email = emailInput ? emailInput.value.trim() : 'bibliotecario@email.com';
    const role = (email.toLowerCase().includes('admin') || email.toLowerCase().includes('bibliotecario')) ? 'ADMIN' : 'USER';

    localStorage.setItem('bookflow_user', JSON.stringify({ email, role }));
    window.location.href = 'index.html';
}

function logout() {
    localStorage.removeItem('bookflow_user');
    window.location.href = 'login.html';
}

async function carregarCategorias() {
    try {
        const res = await fetch(`${API_BASE}/categories`);
        if (!res.ok) return;
        const categorias = await res.json();

        const selectFiltro = document.getElementById('filtroCategoria');
        if (selectFiltro) {
            selectFiltro.innerHTML = '<option value="">Todas as Categorias</option>';
            categorias.forEach(cat => {
                selectFiltro.innerHTML += `<option value="${cat.id}">${escapeHtml(cat.name)}</option>`;
            });
        }

        const selectCadastro = document.getElementById('categoria');
        if (selectCadastro) {
            selectCadastro.innerHTML = '<option value="">Selecione uma categoria</option>';
            categorias.forEach(cat => {
                selectCadastro.innerHTML += `<option value="${cat.id}">${escapeHtml(cat.name)}</option>`;
            });
        }
    } catch (err) {
        console.error(err);
    }
}

async function carregarLivros(catId = '') {
    const tbody = document.getElementById('tabelaCorpo');
    if (!tbody) return;

    try {
        const url = catId ? `${API_BASE}/books?categoryId=${catId}` : `${API_BASE}/books`;
        const res = await fetch(url);
        if (!res.ok) return;
        const livros = await res.json();
        renderizarTabela(livros);
    } catch (err) {
        console.error(err);
    }
}

function filtrarLivros() {
    const select = document.getElementById('filtroCategoria');
    if (select) {
        carregarLivros(select.value);
    }
}

function renderizarTabela(livros) {
    const tbody = document.getElementById('tabelaCorpo');
    const totalInfo = document.getElementById('totalInfo');
    const paginacaoTexto = document.getElementById('paginacaoTexto');

    if (totalInfo) totalInfo.innerText = `${livros.length} livros cadastrados`;
    if (paginacaoTexto) paginacaoTexto.innerText = `1-${livros.length} de ${livros.length} registros`;

    if (!tbody) return;
    tbody.innerHTML = '';

    livros.forEach(b => {
        const catNome = b.category ? b.category.name : '-';
        const dispTexto = b.available ? 'Disponível' : 'Emprestado';

        tbody.innerHTML += `
            <tr>
                <td>${escapeHtml(b.title)}</td>
                <td>${escapeHtml(b.author)}</td>
                <td>${escapeHtml(b.isbn)}</td>
                <td>${escapeHtml(catNome)}</td>
                <td>${dispTexto}</td>
            </tr>
        `;
    });
}

async function cadastrarLivro(event) {
    if (event) event.preventDefault();

    const tituloInput = document.getElementById('titulo');
    const autorInput = document.getElementById('autor');
    const isbnInput = document.getElementById('isbn');
    const categoriaSelect = document.getElementById('categoria');
    const situacaoSelect = document.getElementById('situacao');

    const title = tituloInput ? tituloInput.value.trim() : '';
    const author = autorInput ? autorInput.value.trim() : '';
    const isbn = isbnInput ? isbnInput.value.trim() : '';
    const categoryId = categoriaSelect ? categoriaSelect.value : null;
    const available = situacaoSelect ? situacaoSelect.value === 'true' : true;

    try {
        const res = await fetch(`${API_BASE}/books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                author,
                isbn,
                category: categoryId ? { id: parseInt(categoryId) } : null,
                available
            })
        });

        if (res.ok) {
            alert('Livro cadastrado com sucesso!');
            window.location.href = 'index.html';
        } else {
            alert('Erro ao cadastrar livro no servidor.');
        }
    } catch (err) {
        console.error(err);
        alert('Erro de conexão ao cadastrar livro.');
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
