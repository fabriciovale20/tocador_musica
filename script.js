const songName = document.getElementById('song-name')
const bandName = document.getElementById('band-name')
const song = document.getElementById('audio')
const cover = document.getElementById('cover')
const play = document.getElementById('play')
const next = document.getElementById('next')
const previous = document.getElementById('previous')
const likeButton = document.getElementById('like')
const currentProgress = document.getElementById('current-progress')
const progressContainer = document.getElementById('progress-container')
const shuffleButton = document.getElementById('shuffle')
const repeatButton = document.getElementById('repeat')
const songTime = document.getElementById('song-time')
const totalTime = document.getElementById('total-time')

const rebelde = {
    songName: "Rebelde",
    artist: "RBD",
    file: "RBD",
    liked: false
}

const gruproRevelacao = {
    songName: "Fala baixinho",
    artist: "Grupo Revelação",
    file: "Grupo Revelação",
    liked: false
}

const mcPedrinho = {
    songName: "Gol bolinha, Gol Quadrado 2",
    artist: "MC Pedrinho",
    file: "MC Pedrinho",
    liked: false
}

const originalPlaylist = JSON.parse(localStorage.getItem('playlist')) ?? [rebelde, gruproRevelacao, mcPedrinho]

let sortedPlaylist = [...originalPlaylist]

let index = 0 // Variável para aulixar na música tocada

let isPlaying = false // Variável para sinalizar se a música está tocando

let isShuffled = false // Variável auxlilar para identificar se o botão de aleatório estiver ativa

let repeatOn = false // Variável auxiliar para identificar se o botão de repetir foi clicado


// Função para INICIAR a música
function playSong() {
    play.querySelector('.bi').classList.remove('bi-play-circle-fill')
    play.querySelector('.bi').classList.add('bi-pause-circle-fill')
    song.play()
    isPlaying = true
}

// Função para PAUSAR a música
function pauseSong() {
    play.querySelector('.bi').classList.add('bi-play-circle-fill')
    play.querySelector('.bi').classList.remove('bi-pause-circle-fill')
    song.pause()
    isPlaying = false
}

// Função para quando a música terminar
function playPauseDecider() {
    if (isPlaying === true) {
        pauseSong()
    } else {
        playSong()
    }
}

// Função para verificar se o botão de like
function likeButtonRender() {
    if (sortedPlaylist[index].liked === true) {
        likeButton.querySelector('.bi').classList.remove('bi-heart')
        likeButton.querySelector('.bi').classList.add('bi-heart-fill')
        likeButton.classList.add('button-active')
    } else {
        likeButton.querySelector('.bi').classList.add('bi-heart')
        likeButton.querySelector('.bi').classList.remove('bi-heart-fill')
        likeButton.classList.remove('button-active')
    }
}

// Função identificar diretório do álbum
function initializeSong() {
    cover.src = `imagens/${sortedPlaylist[index].file}.jpg`
    song.src = `songs/${sortedPlaylist[index].songName}.mp3`
    songName.innerText = sortedPlaylist[index].songName
    bandName.innerText = sortedPlaylist[index].artist
    likeButtonRender()
}

// Função de RETORNAR música
function previousSong() {
    if (index === 0) {
        index = sortedPlaylist.length - 1
    } else {
        index -= 1
    }
    initializeSong()
    playSong()
}

// Função de AVANÇAR música
function nextSong() {
    if (index === sortedPlaylist.length - 1) {
        index = 0
    } else {
        index += 1
    }
    initializeSong()
    playSong()
}

// Função para animar o andamento da barra de progresso
function updateProfressBar() {
    // song.currentTime → Quanto tempo a música já tocou
    // song.duration → Duração da música
    const bardWidth = (song.currentTime / song.duration) * 100// Cálculo da largura da barra de progresso
    currentProgress.style.setProperty('--progress', `${bardWidth}%`)
    songTime.innerText = toHHMMSS(song.currentTime)
}

// Função para poder selecionar a partir da barra de progresso a parte da música a ser escutada
function jumpTo(event) {
    const width = progressContainer.clientWidth // Largura total da barra
    const clickPosition = event.offsetX // Onde foi clicado na barra
    const jumpToTime = (clickPosition / width) * song.duration
    song.currentTime = jumpToTime
}

// Função para embaralhar a lista de músicas
function shuffleArray(preShuffleArray) {
    const size = preShuffleArray.length
    let currentIndex = size - 1

    while (currentIndex > 0) {
        let randomIndex = Math.floor(Math.random()* size)
        let aux = preShuffleArray[currentIndex]
        preShuffleArray[currentIndex] = preShuffleArray[randomIndex]
        preShuffleArray[randomIndex] = aux
        currentIndex -= 1
    }
}

// Botão de ALEATÓRIO
function shuffleButtonClicked() {
    if (isShuffled === false) { // Fazendo o embaralhamento das músicas
        isShuffled = true
        shuffleArray(sortedPlaylist)
        shuffleButton.classList.add('button-active')
    } else { // Desafezando o embaralhamento das músicas
        isShuffled = false
        sortedPlaylist = [...originalPlaylist]
        shuffleButton.classList.remove('button-active')
    }
}

// Botão de REPETIR
function repeatButtonClicked() {
    if (repeatOn == false) {
        repeatOn = true
        repeatButton.classList.add('button-active')
    } else {
        repeatOn = false
        repeatButton.classList.remove('button-active')
    }
}

// Função que passa para a próxima músicas quando finalizada ou quando a opção de repetir estiver ativa
function nextOnRepeat() {
    if (repeatOn == false) {
        nextSong()
    } else {
        playSong()
    }
}

// Função auxiliar para formatação da duração da música em formato 00:00:00 (HH:MM:SS)
function toHHMMSS(originalNumber) {
    let hours = Math.floor(originalNumber / 3600)
    let min = Math.floor((originalNumber - hours * 3600) / 60)
    let secs = Math.floor(originalNumber - hours * 3600 - min * 60)

    return `${hours.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Função para informar a duração total da atual música
function updateTotalTime() {
    totalTime.innerText = toHHMMSS(song.duration)
}

// Função para quando o botão de Like for clicado
function likeButtonClicked() {
    if (sortedPlaylist[index].liked === false) {
        sortedPlaylist[index].liked = true
    } else {
        sortedPlaylist[index].liked = false
    }

    likeButtonRender()

    localStorage.setItem('playlist', JSON.stringify(originalPlaylist))
}

initializeSong()

play.addEventListener('click', playPauseDecider) // Clicando no botão de PLAY
previous.addEventListener('click', previousSong) // Clicando no botão de ANTEIROR
next.addEventListener('click', nextSong) // Clicando no botão de PRÓXIMO
song.addEventListener('timeupdate', updateProfressBar)
song.addEventListener('ended', nextOnRepeat)
song.addEventListener('loadedmetadata', updateTotalTime)
progressContainer.addEventListener('click', jumpTo)
shuffleButton.addEventListener('click', shuffleButtonClicked)
repeatButton.addEventListener('click', repeatButtonClicked)
likeButton.addEventListener('click', likeButtonClicked)