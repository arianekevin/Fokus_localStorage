const html = document.querySelector('html');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const startPauseBt = document.querySelector('#start-pause');
const botoes = document.querySelectorAll('.app__card-button');
const musicaFocoInput = document.querySelector('#alternar-musica');
const iniciarBt = document.querySelector('#start-pause span');
const tempoNaTela = document.querySelector('#timer');
const musica = new Audio('./sons/luna-rise-part-one.mp3');
const musicaIniciar = new Audio('./sons/play.wav');
const musicaPausar = new Audio('./sons/pause.mp3');
const musicaFinalizar = new Audio('./sons/beep.mp3');
musica.loop = true;
let tempoDecorridoEmSegundos = 3;
let intervaloId = null;

focoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 3;
    alterarContexto('foco');
    focoBt.classList.add('active');
})

curtoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 1;
    alterarContexto('descanso-curto');
    curtoBt.classList.add('active');
})

longoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 3;
    alterarContexto('descanso-longo');
    longoBt.classList.add('active');
})

function alterarContexto(contexto) {
    mostrarTempo();
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `./imagens/${contexto}.png`);
    botoes.forEach((contexto) => {
        contexto.classList.remove('active');
    });
    switch (contexto) {
        case 'foco':
            titulo.innerHTML = `Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>`
            break;
        case 'descanso-curto':
            titulo.innerHTML = `Que tal dar uma respirada?<br>
            <strong class="app__title-strong">Faça uma pausa curta!</strong>`
            break;
        case 'descanso-longo':
            titulo.innerHTML = `Hora de voltar à superfície.<br>
            <strong class="app__title-strong">Faça uma pausa longa.</strong>`
            break;
    }
}

musicaFocoInput.addEventListener('change', () => {
    if (musica.paused) {
        musica.play();
    } else {
        musica.pause();
    }
})

const contagemRegressiva = () => {
    if (tempoDecorridoEmSegundos <= 0) {
        musicaFinalizar.play();
        alert('Temporizador finalizado!');
        const focoAtivo = html.getAttribute('data-contexto') === 'foco';
        if (focoAtivo) {
            const evento = new CustomEvent('FocoFinalizado');
            document.dispatchEvent(evento);
        }
        zerar();
        return;
    }
    tempoDecorridoEmSegundos -= 1;
    mostrarTempo();
}

startPauseBt.addEventListener('click', startPause);

function startPause() {
    if (intervaloId) {
        musicaPausar.play();
        zerar();
        return;
    }
    musicaIniciar.play();
    intervaloId = setInterval(contagemRegressiva, 1000);
    iniciarBt.textContent = 'Pausar';
}

function zerar() {
    clearInterval(intervaloId);
    intervaloId = null;
    iniciarBt.textContent = 'Começar';
    tempoDecorridoEmSegundos = 5;
}

function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'});
    tempoNaTela.innerHTML = `${tempoFormatado}`;
}

mostrarTempo();