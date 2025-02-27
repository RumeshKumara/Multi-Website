document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const movesCount = document.getElementById('moves-count');
    const timeValue = document.getElementById('time');
    const restartButton = document.getElementById('restart');
    const gameOverElement = document.getElementById('game-over');
    const finalMovesElement = document.getElementById('final-moves');
    const finalTimeElement = document.getElementById('final-time');
    const playAgainButton = document.getElementById('play-again');

    let cards;
    let interval;
    let firstCard = false;
    let secondCard = false;
    let moves = 0;
    let seconds = 0;
    let minutes = 0;
    let firstCardValue;
    let secondCardValue;
    let matchedPairs = 0;
    let totalPairs = 8;
    let isGameActive = false;

    // Card emojis
    const emojis = [
        '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
        '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'
    ];

    // Timer
    const timeGenerator = () => {
        seconds += 1;
        if (seconds >= 60) {
            minutes += 1;
            seconds = 0;
        }
        
        // Format time
        let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
        let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
        timeValue.innerHTML = `${minutesValue}:${secondsValue}`;
    };

    // Calculate moves
    const movesCounter = () => {
        moves++;
        movesCount.innerHTML = moves;
    };

    // Pick random cards
    const generateRandom = (size = 16) => {
        // Create a temporary array
        let tempArray = [...emojis];
        // Randomize the array
        tempArray.sort(() => Math.random() - 0.5);
        return tempArray;
    };

    // Initialize game
    const initializeGame = () => {
        isGameActive = true;
        matchedPairs = 0;
        moves = 0;
        seconds = 0;
        minutes = 0;
        
        // Clear previous interval
        clearInterval(interval);
        
        // Start timer
        interval = setInterval(timeGenerator, 1000);
        
        // Initial moves
        movesCount.innerHTML = moves;
        
        // Generate cards
        const randomCards = generateRandom();
        gameContainer.innerHTML = '';
        
        randomCards.forEach((emoji) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.setAttribute('data-emoji', emoji);
            
            // Create card content
            card.innerHTML = `
                <div class="card-front">${emoji}</div>
                <div class="card-back"></div>
            `;
            
            // Add click event
            card.addEventListener('click', () => {
                if (!isGameActive) return;
                
                // If the card is not flipped and not matched
                if (!card.classList.contains('flipped') && !card.classList.contains('matched')) {
                    // Flip the card
                    card.classList.add('flipped');
                    
                    // If it's the first card
                    if (!firstCard) {
                        firstCard = card;
                        firstCardValue = card.getAttribute('data-emoji');
                    } else {
                        // If it's the second card
                        movesCounter();
                        secondCard = card;
                        secondCardValue = card.getAttribute('data-emoji');
                        
                        // If both cards match
                        if (firstCardValue === secondCardValue) {
                            firstCard.classList.add('matched');
                            secondCard.classList.add('matched');
                            
                            // Reset cards
                            firstCard = false;
                            secondCard = false;
                            
                            // Increment matched pairs
                            matchedPairs++;
                            
                            // Check if game is over
                            if (matchedPairs === totalPairs) {
                                gameOver();
                            }
                        } else {
                            // If cards don't match, flip them back
                            let tempFirst = firstCard;
                            let tempSecond = secondCard;
                            
                            firstCard = false;
                            secondCard = false;
                            
                            // Disable all cards temporarily
                            isGameActive = false;
                            
                            setTimeout(() => {
                                tempFirst.classList.remove('flipped');
                                tempSecond.classList.remove('flipped');
                                isGameActive = true;
                            }, 900);
                        }
                    }
                }
            });
            
            gameContainer.appendChild(card);
        });
        
        cards = document.querySelectorAll('.card');
    };

    // Game over
    const gameOver = () => {
        clearInterval(interval);
        isGameActive = false;
        
        // Show game over screen
        finalMovesElement.innerHTML = moves;
        finalTimeElement.innerHTML = timeValue.innerHTML;
        gameOverElement.classList.add('show');
    };

    // Restart game
    const restartGame = () => {
        gameOverElement.classList.remove('show');
        initializeGame();
    };

    // Event listeners
    restartButton.addEventListener('click', restartGame);
    playAgainButton.addEventListener('click', restartGame);

    // Initialize the game
    initializeGame();
});