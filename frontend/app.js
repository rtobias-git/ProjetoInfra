const API_BASE = '/api';

document.addEventListener('DOMContentLoaded', () => {
    carregarCategorias();
    carregarLivros();
});

async function carregarCategorias() {
    try {
        const res = await fetch(`${API_BASE}/categories`);
        if (!res.ok) return;
        const categorias = await res.json();
        const select = document.getElementById('filtroCategoria');
        if (!select) return;
        select.innerHTML = '<option value="">Todas as Categorias</option>';
        categorias.forEach(cat => {
            select.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
        });
    } catch (err) {
        console.error(err);
    }
}

async function carregarLivros(catId = '') {
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

    if (!tbody || livros.length === 0) return;

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

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
