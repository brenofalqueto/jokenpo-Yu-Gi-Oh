/* um objeto de objetos, memória */ 
const state = {
    score: {
        playerScore: 5,
        computerScore: 5,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
        power: document.getElementById("card-power"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSiders: {
        player1: "player-cards",
        player1Box: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#computer-cards"),
    },
    actions: {
        button: document.getElementById("next-duel"),
    },
};

//const playerSiders = {
//    player1: "player-cards",
//    computer: "computer-cards",
//};

/* enumeração (enum) dos cards */

const pathImages = "src/assets/icons/";
/* vetor de dados */
const cardData = [
    {
        id:0,
        name: "Mochileiro",
        type: "Floresta",
        power: 34,
        img: `${pathImages}backpacker-stone-card.png`,
        WinOf: [1],
        LoseOf: [2],
    },
    {
        id:1,
        name: "Místico",
        type: "Gelo",
        power: 52,
        img: `${pathImages}arcane-stone-card.png`,
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id:2,
        name: "Modificado",
        type: "Metal",
        power: 43,
        img: `${pathImages}modificado-stone-card.png`,
        WinOf: [0],
        LoseOf: [1],
    },
];


async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}


async function createCardImage(randomIdCard, fieldSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "src/assets/icons/back-stone-card.png");
    cardImage.setAttribute("data-id", randomIdCard);
    cardImage.classList.add("card");

    if (fieldSide === state.playerSiders.player1) {
        
        cardImage.addEventListener("mouseover", ()=>{
            drawSelectCard(randomIdCard);
         });

        cardImage.addEventListener("click", ()=>{
            setCardsField(cardImage.getAttribute("data-id"));
        });

    }

    return cardImage;

} 


async function setCardsField(randomIdCard){
    
    await removeAllCardsImages();
    
    let computerCardId = await getRandomCardId();
    

    await showHiddenCardFieldsImages(true);
    //state.fieldCards.player.style.display = "block";
    //state.fieldCards.computer.style.display = "block";

    //await hiddenCardDetails();

    state.fieldCards.player.src = cardData[randomIdCard].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(randomIdCard, computerCardId);

    await updateScore();
    await drawButton(duelResults);

}

async function showHiddenCardFieldsImages(value) {
    if(value === true){
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }

    if(value === false){
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

async function hiddenCardDetails (){
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
    state.cardSprites.power.innerText = "";
}

async function drawButton(text){
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";

}

// altera valor visualmente
async function updateScore(){
    state.score.scoreBox.innerText = `Win(oponente): ${state.score.playerScore} * Lose(you): ${state.score.computerScore}`;
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "Empate";
    let playerCard = cardData[playerCardId];

    if (playerCard.WinOf.includes(computerCardId)){
        duelResults = "Ganhou";
        await playAudio("win");
        state.score.playerScore--;

        //console.log(state.cardSprites.power);
    }

    if (playerCard.LoseOf.includes(computerCardId)){
        duelResults = "Perdeu";
        await playAudio("lose");
        state.score.computerScore--;
    }

    return duelResults;

}

async function removeAllCardsImages() {

    let cards = state.playerSiders.computerBox;
    let imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
    
    cards = state.playerSiders.player1Box;
    imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

}

async function drawSelectCard(index){
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = "Class: " + cardData[index].name;
    state.cardSprites.type.innerText = "Type: " + cardData[index].type;

    state.cardSprites.power.innerText = "Power: " + cardData[index].power;

}


async function drawCards (cardNumbers, fieldSide) {

    for (let i=0; i < cardNumbers; i++){
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }

}

async function resetDuel() {

    await hiddenCardDetails();

    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();

}


async function playAudio(status) {
    const audio = new Audio(`src/assets/audios/${status}.wav`);
    
    try {
        audio.play();
    } catch {}
}


function init() {

    const bgm = document.getElementById("bgm");
    bgm.play();

    showHiddenCardFieldsImages(false);

    drawCards(5, state.playerSiders.player1);
    drawCards(5, state.playerSiders.computer);

}

init();