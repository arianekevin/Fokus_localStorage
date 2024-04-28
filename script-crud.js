const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
const formAdicionarTarefa = document.querySelector('.app__form-add-task');
const textArea = document.querySelector('.app__form-textarea');
const ulTarfas = document.querySelector('.app__section-task-list');
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description');
const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas');
const btnRemoverTodas = document.querySelector('#btn-remover-todas');

let tarefas = localStorage.getItem('tarefas') ? JSON.parse(localStorage.getItem('tarefas')) : [];
let tarefaSelecionada = null;
let liTarefaSelecionada = null;

function atualizarTarefas () {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

btnAdicionarTarefa.addEventListener('click', () => {
    if (formAdicionarTarefa) {
        formAdicionarTarefa.classList.toggle('hidden');
    }
});

formAdicionarTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const tarefa = {
        descricao: textArea.value,
    }
    tarefas.push(tarefa);
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarfas.append(elementoTarefa);
    atualizarTarefas();
    if (formAdicionarTarefa) {
        textArea.value = '';
        formAdicionarTarefa.classList.toggle('hidden');
    }
})

function criarElementoTarefa(tarefa) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svg = document.createElement('svg');
    svg.innerHTML = `<svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>`;
    const paragrafo = document.createElement('p');
    paragrafo.textContent = tarefa.descricao;
    paragrafo.classList.add('app__section-task-list-item-description');

    const botao = document.createElement('button');
    botao.onclick = () => {

        const novaDescricao = prompt('Qual o novo nome da tarefa?', tarefa.descricao);

        if (!novaDescricao) {
            return;
        }

        paragrafo.textContent = tarefa.descricao = novaDescricao;
        atualizarTarefas();
    }
    const imagemBotao = document.createElement('img');
    imagemBotao.setAttribute('src', './imagens/edit.png');
    botao.append(imagemBotao);
    botao.classList.add('app_button-edit');

    li.append(svg);
    li.append(paragrafo);
    li.append(botao);

    if (tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete');
        botao.setAttribute('disabled', 'disabled');
    } else {
        li.onclick = () => {
            if (tarefaSelecionada === tarefa) {
                li.classList.remove('app__section-task-list-item-active');
                paragrafoDescricaoTarefa.textContent = '';
                tarefaSelecionada = null;
                liTarefaSelecionada = null;
                return;
            }
            tarefaSelecionada = tarefa;
            liTarefaSelecionada = li;
            paragrafoDescricaoTarefa.textContent = tarefa.descricao;
            const todasLi = document.querySelectorAll('.app__section-task-list-item-active');
            if (todasLi) {
                todasLi.forEach(li => {
                    li.classList.remove('app__section-task-list-item-active');
                })
            }
            li.classList.add('app__section-task-list-item-active');
        }
    }

    return li;
}

tarefas.forEach(t => {
    const elementoTarefa = criarElementoTarefa(t);
    ulTarfas.append(elementoTarefa);
})

document.addEventListener('FocoFinalizado', ()  => {
    if (tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active');
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled');
        tarefaSelecionada.completa = true;
        atualizarTarefas();
    }
})

removerTarefas = (seletor) => {
    const todasTarefas = document.querySelectorAll(seletor);
    if (todasTarefas) {
        todasTarefas.forEach(a => {
            a.remove();
        });
    }
};

btnRemoverConcluidas.onclick = () => {
    removerTarefas('.app__section-task-list-item-complete');
    tarefas = tarefas.filter(t => !t.completa);
    atualizarTarefas();
};

btnRemoverTodas.onclick = () => {
    removerTarefas('.app__section-task-list-item');
    tarefas = [];
    atualizarTarefas();
};