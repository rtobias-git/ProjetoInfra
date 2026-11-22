const API_BASE = '/api';

document.addEventListener('DOMContentLoaded', () => {
    carregarCategorias();
    carregarLivros();
});

async function carregarCategorias() {
    try {
        const res = await fetch(`${API_BASE}/categories`);
        const categorias = await res.json();
        const select = document.getElementById('filtroCategoria');
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
        const livros = await res.json();
        renderizarTabela(livros);
    } catch (err) {
        console.error(err);
        document.getElementById('tabelaCorpo').innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Erro ao carregar dados</td></tr>';
    }
}

function filtrarLivros() {
    const catId = document.getElementById('filtroCategoria').value;
    carregarLivros(catId);
}

function renderizarTabela(livros) {
    const tbody = document.getElementById('tabelaCorpo');
    const totalInfo = document.getElementById('totalInfo');
    const paginacaoTexto = document.getElementById('paginacaoTexto');

    totalInfo.innerText = `${livros.length} livros cadastrados`;
    paginacaoTexto.innerText = `1-${livros.length} de ${livros.length} registros`;

    if (livros.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">Nenhum livro cadastrado</td></tr>';
        return;
    }

    tbody.innerHTML = '';
    livros.forEach(b => {
        const catNome = b.category ? b.category.name : '-';
        const dispBadge = b.available
            ? '<span class="badge-disponivel">Disponível</span>'
            : '<span class="badge-emprestado">Emprestado</span>';

        tbody.innerHTML += `
            <tr>
                <td>${escapeHtml(b.title)}</td>
                <td>${escapeHtml(b.author)}</td>
                <td>${escapeHtml(b.isbn)}</td>
                <td><span class="badge-categoria">${escapeHtml(catNome)}</span></td>
                <td>${dispBadge}</td>
            </tr>
        `;
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
