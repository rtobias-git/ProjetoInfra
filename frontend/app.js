const API_BASE = '/api';

let listaLivrosGlobal = [];
let listaCategoriasGlobal = [];

document.addEventListener('DOMContentLoaded', () => {
    carregarCategorias().then(() => carregarLivros());
});

async function carregarCategorias() {
    try {
        const res = await fetch(`${API_BASE}/categories`);
        if (!res.ok) throw new Error('Falha ao carregar categorias');
        listaCategoriasGlobal = await res.json();

        const selectModal = document.getElementById('livroCategoria');
        const selectFiltro = document.getElementById('filtroCategoria');

        selectModal.innerHTML = '<option value="" disabled selected>Selecione...</option>';
        selectFiltro.innerHTML = '<option value="">Todas as Categorias</option>';

        listaCategoriasGlobal.forEach(cat => {
            selectModal.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
            selectFiltro.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
        });

        document.getElementById('statCategorias').innerText = listaCategoriasGlobal.length;
    } catch (err) {
        console.error('Erro:', err);
    }
}

async function carregarLivros() {
    try {
        const catId = document.getElementById('filtroCategoria').value;
        const url = catId ? `${API_BASE}/books?categoryId=${catId}` : `${API_BASE}/books`;

        const res = await fetch(url);
        if (!res.ok) throw new Error('Falha ao carregar livros');
        listaLivrosGlobal = await res.json();

        atualizarEstatisticas(listaLivrosGlobal);
        renderizarTabela(listaLivrosGlobal);
    } catch (err) {
        console.error('Erro:', err);
        document.getElementById('tabelaLivros').innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-danger py-4">
                    <i class="bi bi-exclamation-triangle me-2"></i>Erro ao carregar dados do backend. Verifique os contêineres.
                </td>
            </tr>
        `;
    }
}

function renderizarTabela(livros) {
    const tbody = document.getElementById('tabelaLivros');

    if (livros.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-5">
                    <i class="bi bi-inbox fs-3 d-block mb-2"></i>Nenhum livro encontrado.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = '';
    livros.forEach(b => {
        const statusBadge = b.available
            ? `<span class="badge bg-success badge-status" onclick="alternarStatus(${b.id})" title="Clique para emprestar">
                 <i class="bi bi-check-circle me-1"></i>Disponível
               </span>`
            : `<span class="badge bg-warning text-dark badge-status" onclick="alternarStatus(${b.id})" title="Clique para devolver">
                 <i class="bi bi-clock-history me-1"></i>Emprestado
               </span>`;

        tbody.innerHTML += `
            <tr>
                <td>
                    <span class="fw-bold text-dark">${escapeHtml(b.title)}</span>
                </td>
                <td>${escapeHtml(b.author)}</td>
                <td><code>${escapeHtml(b.isbn)}</code></td>
                <td>
                    <span class="badge bg-light text-dark border">
                        ${b.category ? escapeHtml(b.category.name) : '-'}
                    </span>
                </td>
                <td class="text-center">${statusBadge}</td>
                <td class="text-end pe-4">
                    <button class="btn btn-sm btn-outline-danger" onclick="excluirLivro(${b.id})" title="Excluir Livro">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

function atualizarEstatisticas(livros) {
    const total = livros.length;
    const disp = livros.filter(l => l.available).length;
    const emp = total - disp;

    document.getElementById('statTotal').innerText = total;
    document.getElementById('statDisponiveis').innerText = disp;
    document.getElementById('statEmprestados').innerText = emp;
}

function filtrarTabelaLocal() {
    const query = document.getElementById('filtroTexto').value.toLowerCase().trim();
    if (!query) {
        renderizarTabela(listaLivrosGlobal);
        return;
    }

    const filtrados = listaLivrosGlobal.filter(b =>
        b.title.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query) ||
        b.isbn.toLowerCase().includes(query)
    );

    renderizarTabela(filtrados);
}

async function salvarLivro(event) {
    event.preventDefault();

    const novoLivro = {
        title: document.getElementById('livroTitulo').value.trim(),
        author: document.getElementById('livroAutor').value.trim(),
        isbn: document.getElementById('livroIsbn').value.trim(),
        category: { id: parseInt(document.getElementById('livroCategoria').value) },
        available: document.getElementById('livroDisponivel').value === 'true'
    };

    try {
        const res = await fetch(`${API_BASE}/books`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoLivro)
        });

        if (!res.ok) {
            alert('Erro ao salvar livro! Verifique se o ISBN já existe.');
            return;
        }

        document.getElementById('formLivro').reset();
        bootstrap.Modal.getInstance(document.getElementById('modalLivro')).hide();
        carregarLivros();
    } catch (err) {
        alert('Erro de conexão ao salvar livro.');
    }
}

async function salvarCategoria(event) {
    event.preventDefault();

    const novaCategoria = {
        name: document.getElementById('categoriaNome').value.trim()
    };

    try {
        const res = await fetch(`${API_BASE}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novaCategoria)
        });

        if (!res.ok) {
            alert('Erro ao cadastrar categoria!');
            return;
        }

        document.getElementById('formCategoria').reset();
        bootstrap.Modal.getInstance(document.getElementById('modalCategoria')).hide();
        await carregarCategorias();
    } catch (err) {
        alert('Erro de conexão ao salvar categoria.');
    }
}

async function alternarStatus(id) {
    try {
        const res = await fetch(`${API_BASE}/books/${id}/toggle`, { method: 'PATCH' });
        if (res.ok) carregarLivros();
    } catch (err) {
        console.error('Erro ao alternar status:', err);
    }
}

async function excluirLivro(id) {
    if (!confirm('Deseja realmente remover este livro do acervo?')) return;

    try {
        const res = await fetch(`${API_BASE}/books/${id}`, { method: 'DELETE' });
        if (res.ok) {
            carregarLivros();
        } else {
            alert('Não foi possível excluir o livro.');
        }
    } catch (err) {
        alert('Erro de conexão ao excluir livro.');
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
