let playBtn = document.querySelector('#mainPlayBtn')
let audio = document.querySelector('#audio')
let btnPrev = document.querySelector('#bntPrev')
let btnNext = document.querySelector('#btnNext')
let trackTitle = document.querySelector('.track-title')
let artistName = document.querySelector('.artist-name')
let cover = document.querySelector('.cover')
let slider = document.querySelector('.slider')
let thumb = document.querySelector('.slider-thumb')
let progress = document.querySelector('.progress')
let time = document.querySelector('.time')
let fullTime = document.querySelector('.fulltime')
let volumeSlider = document.querySelector('.volume-slider .slider')
let volumeProgress = document.querySelector('.volume-slider .progress')
let volumeIcon = document.querySelector('.volume-icon')

// faixa tocando
let trackPlaying = false

// volume mudo
let volumeMuted = false

// qual faixa está carregada no momento (com base no id numérico)
let trackId = 0

// nome das musicas
let tracks = [
    '5 a Seco - Vem e Vai',
    'Jonas Esticado - Garota',
    'Jorge e Mateus - 31_12',
    'Nando Reis - N',
    'Projota - A Voz E O Violão',
    'TNBH - Reflections'
]

// artistas
let artists = [
    '5 a Seco',
    'Jonas Esticado',
    'Jorge & Mateus',
    'Nando Reis',
    'Projota',
    'The Neighbourhood'
]

// capas
let covers = [
    '5aseco',
    'jonasesticado',
    'jorgeematheus',
    'nandoreis',
    'vozeviolao',
    'tnbh',
]

// evento de click

playBtn.addEventListener('click', playTrack)

// função playTrack
function playTrack() {
    // se estiver tocando
    if (trackPlaying === false) {
        // reproduza o audio
        audio.play()

        // adicione icone de pausa no botão
        playBtn.innerHTML = '<i class="fa-solid fa-circle-pause material-symbols-outlined"></i>'

        // defina track playing como verdadeiro pois o audio esta tocando
        trackPlaying = true

    } else {
        // pausar o audio
        audio.pause()

        // adicone o botão de play ao icone
        playBtn.innerHTML = '<i class="fa-solid fa-circle-play material-symbols-outlined"></i>'

        // defina track playing como false pois o audio está pausado
        trackPlaying = false
    }
}

// função trocar de faixa
function switchTrack() {
    // se o audio estiver tocando
    if (trackPlaying === true) {
        audio.play()
    }
}

// fonte da faixa
let trackSrc = 'assets/musicas/' + tracks[trackId] + '.mp3'

// troca de faixa
function loadTrack() {
    // definir a faixa de audio
    audio.src = 'assets/musicas/' + tracks[trackId] + '.mp3'

    // recarregar faixa de audio
    audio.load()

    // defina o titulo da faixa
    trackTitle.innerHTML = tracks[trackId]

    // defina o nome do artista
    artistName.innerHTML = artists[trackId]

    // defina a capa da musica
    cover.src = 'assets/img/' + covers[trackId] + '.jpg'

    // linha de campo de tempo para 0
    progress.style.width = 0
    thumb.style.left = 0

    // espere o carregamento do audio
    audio.addEventListener('loadeddata', () => {
        // exivir a duração do audio
        setTime(fullTime, audio.duration)
        // valor maximo do controle deslizante
        slider.setAttribute('max', audio.duration)
    })
}

// chamada da função carregar faixa.
loadTrack()

// definir evento de click para o botão anterior
btnPrev.addEventListener('click', () => {
    // diminuir id da faixa
    trackId--

    // se o id da faixa ficar abaixo de 0
    if (trackId < 0) {
        // ir para a ultima faixa
        trackId = tracks.length - 1
    }
    // carregar o audio/faixa
    loadTrack()
    // inicie a função switchTrack
    switchTrack()
})

// definir evento de click para o botão proximo
btnNext.addEventListener('click', nextTrack)

// função nextTrack
function nextTrack() {
    // incrementar id da faixa
    trackId++
    if (trackId > tracks.length - 1) {
        // ir para a primeira faixa
        trackId = 0
    }
    // carregar o audio/faixa
    loadTrack()
    // inicie a função switchTrack
    switchTrack()
}

// quando o audio terminar mude para a proxima faixa
audio.addEventListener('ended', nextTrack)

// formatando o tempo
function setTime(output, input) {
    // calcular minutos das faixas
    let minutes = Math.floor(input / 60)
    // calcular segundos das faixas
    let seconds = Math.floor(input % 60)
    // se os segundos forem abaixo de 10
    if (seconds < 10) {
        // adicione um zero antes do primeiro numero
        output.innerHTML = minutes + ':0' + seconds
        // se for mais que 10
    } else {
        output.innerHTML = minutes + ':' + seconds
    }
}

// output da duração do audio
setTime(fullTime, audio.duration)

// agora usamos o evento 'timeupdate' para alterar a posição do controle deslizante e o tempo atual do áudio toda vez que o áudio avança.
// este evento dispara a cada segundo que o tempo de áudio progride cada vez mais

// pra quando o tempo da musica mudar.
audio.addEventListener('timeupdate', () => {
    // obter o tempo do audio atual
    let currentAudioTime = Math.floor(audio.currentTime)
    // obter a porcentagem
    let timePercentage = (currentAudioTime / audio.duration) * 100 + '%'
    // emitir o tempo do audio atual
    setTime(time, currentAudioTime)
    // definindo o progresso do deslizante para porcentagem
    progress.style.width = timePercentage
    thumb.style.left = timePercentage
})

// na função 'customSlider', tornamos nosso controle deslizante da linha do tempo interativo quando o usuário o arrasta.

// função para controlar os valores do deslizante

function customSlider(){
    // obter a percentagem
    let val = (slider.value / audio.duration) * 100 + '%'
    // definindo o thumb e progresso para o valor atual
    progress.style.width = val
    thumb.style.left = val
    // emitir o tempo atual do audio
    setTime(time, slider.value)
    // definir o tempo atual do áudio para o valor do controle deslizante
    audio.currentTime = slider.value
}

// chamando a função
customSlider()

// repetir a função quando o controle deslizante for selecionado
slider.addEventListener('input', customSlider)

// uma abordagem semelhante também é usada para o controle deslizante de volume.
// E mudaremos o ícone com base em quão alto o volume está.

// valor atual do controle deslizante de volume
let val

// volume deslizante
function customVolumeSlider(){
    // obter o valor máximo do atributo do controle deslizante
    let maxVal = volumeSlider.getAttribute('max')
    // pegando a porcentagem
    val = (volumeSlider.value / maxVal) * 100 + '%'
    // definindo o thumb e avançando para o valor atual
    volumeProgress.style.width = val
    // defina o volume do audio para o valor atual
    audio.volume = volumeSlider.value / 100
    // alterar o icone
    // se o volume estiver alto
    if(audio.volume > 0.5){
        // definir o ícone alto
        volumeIcon.innerHTML = `<i class="fa-solid fa-volume-high material-symbols-outlined"></i>`
    }else if(audio.volume === 0) {
        // se o volume estiver mudo
        // alterar o icone
        volumeIcon.innerHTML = `<i class="fa-solid fa-volume-xmark material-symbols-outlined"></i>`
    }else{
        // se estiver baixo
        // alterar icone
        volumeIcon.innerHTML = `<i class="fa-solid fa-volume-low material-symbols-outlined"></i>`
    }
}

// execute a função de controle deslizante de volume
customVolumeSlider()

// execute a função novamente quando o controle deslizante de volume for selecionado
volumeSlider.addEventListener('input', customVolumeSlider)

// criaremos outro botão de alternância para o ícone de volume. que irá ativar e desativar o som do áudio. 
// usamos o mesmo método para reproduzir e pausar o áudio no início do javascript.

// adicionar um evento de clique ao ícone de volume
volumeIcon.addEventListener('click', () => {
    // se o volume estiver mudo
    if(volumeMuted === false){
        // mude para o icone mudo
        volumeIcon.innerHTML = `<i class="fa-solid fa-volume-xmark material-symbols-outlined"></i>`
        // deixar o audio mudo
        audio.volume = 0
        // definir o controle deslizante de volume para zero
        volumeProgress.style.width = 0
        // definir o volumeMuted como true, pois o volume agora está mudo
        volumeMuted = true
    }else{
        // se o volume estiver mudo
        volumeIcon.innerHTML = `<i class="fa-solid fa-volume-low material-symbols-outlined"></i>`
        // ative o volume definindo-o para um valor acima de zero
        audio.volume = 0.5
        // defina o controle deslizante de progresso do volume para o valor atual
        volumeProgress.style.width = val
        // defina o volumeMuted como falso, porque o volume não está mais silenciado
        volumeMuted = false
    }
})
