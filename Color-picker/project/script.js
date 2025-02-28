document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const colorDisplay = document.getElementById('color-display');
    const redSlider = document.getElementById('red');
    const greenSlider = document.getElementById('green');
    const blueSlider = document.getElementById('blue');
    const redValue = document.getElementById('red-value');
    const greenValue = document.getElementById('green-value');
    const blueValue = document.getElementById('blue-value');
    const hexValue = document.getElementById('hex-value');
    const rgbValue = document.getElementById('rgb-value');
    const copyHexBtn = document.getElementById('copy-hex');
    const copyRgbBtn = document.getElementById('copy-rgb');
    const saveColorBtn = document.getElementById('save-color');
    const clearColorsBtn = document.getElementById('clear-colors');
    const colorPalette = document.getElementById('color-palette');
    const colorInput = document.getElementById('color-input');
    const notification = document.getElementById('notification');

    // Variables
    let currentColor = {
        r: 0,
        g: 0,
        b: 0
    };

    // Load saved colors from localStorage
    let savedColors = JSON.parse(localStorage.getItem('savedColors')) || [];
    
    // Initialize the color palette
    updateColorPalette();

    // Functions
    function updateColor() {
        const hexCode = rgbToHex(currentColor.r, currentColor.g, currentColor.b);
        const rgbCode = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;
        
        // Update the color display
        colorDisplay.style.backgroundColor = rgbCode;
        
        // Update the text values
        hexValue.value = hexCode;
        rgbValue.value = rgbCode;
        
        // Update the color input
        colorInput.value = hexCode;
        
        // Update slider backgrounds
        updateSliderBackgrounds();
    }

    function updateSliderValues() {
        redValue.textContent = currentColor.r;
        greenValue.textContent = currentColor.g;
        blueValue.textContent = currentColor.b;
    }

    function updateSliderBackgrounds() {
        redSlider.style.background = `linear-gradient(to right, rgb(0, ${currentColor.g}, ${currentColor.b}), rgb(255, ${currentColor.g}, ${currentColor.b}))`;
        greenSlider.style.background = `linear-gradient(to right, rgb(${currentColor.r}, 0, ${currentColor.b}), rgb(${currentColor.r}, 255, ${currentColor.b}))`;
        blueSlider.style.background = `linear-gradient(to right, rgb(${currentColor.r}, ${currentColor.g}, 0), rgb(${currentColor.r}, ${currentColor.g}, 255))`;
    }

    function rgbToHex(r, g, b) {
        return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
    }

    function componentToHex(c) {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }

    function hexToRgb(hex) {
        // Remove the # if present
        hex = hex.replace('#', '');
        
        // Parse the hex values
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        return { r, g, b };
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                showNotification();
            })
            .catch(err => {
                console.error('Could not copy text: ', err);
            });
    }

    function showNotification() {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    }

    function saveColor() {
        const colorToSave = hexValue.value;
        
        // Check if color already exists in saved colors
        if (!savedColors.includes(colorToSave)) {
            savedColors.push(colorToSave);
            localStorage.setItem('savedColors', JSON.stringify(savedColors));
            updateColorPalette();
        }
    }

    function clearColors() {
        savedColors = [];
        localStorage.removeItem('savedColors');
        updateColorPalette();
    }

    function updateColorPalette() {
        colorPalette.innerHTML = '';
        
        savedColors.forEach(color => {
            const swatch = document.createElement('div');
            swatch.classList.add('color-swatch');
            swatch.style.backgroundColor = color;
            swatch.setAttribute('data-color', color);
            
            swatch.addEventListener('click', () => {
                const rgb = hexToRgb(color);
                
                // Update sliders
                redSlider.value = rgb.r;
                greenSlider.value = rgb.g;
                blueSlider.value = rgb.b;
                
                // Update current color
                currentColor = rgb;
                
                // Update display
                updateSliderValues();
                updateColor();
            });
            
            colorPalette.appendChild(swatch);
        });
    }

    // Event Listeners
    redSlider.addEventListener('input', () => {
        currentColor.r = parseInt(redSlider.value);
        redValue.textContent = currentColor.r;
        updateColor();
    });

    greenSlider.addEventListener('input', () => {
        currentColor.g = parseInt(greenSlider.value);
        greenValue.textContent = currentColor.g;
        updateColor();
    });

    blueSlider.addEventListener('input', () => {
        currentColor.b = parseInt(blueSlider.value);
        blueValue.textContent = currentColor.b;
        updateColor();
    });

    copyHexBtn.addEventListener('click', () => {
        copyToClipboard(hexValue.value);
    });

    copyRgbBtn.addEventListener('click', () => {
        copyToClipboard(rgbValue.value);
    });

    saveColorBtn.addEventListener('click', saveColor);
    clearColorsBtn.addEventListener('click', clearColors);

    colorInput.addEventListener('input', () => {
        const rgb = hexToRgb(colorInput.value);
        
        // Update sliders
        redSlider.value = rgb.r;
        greenSlider.value = rgb.g;
        blueSlider.value = rgb.b;
        
        // Update current color
        currentColor = rgb;
        
        // Update display
        updateSliderValues();
        updateColor();
    });

    // Initialize the color display
    updateSliderValues();
    updateColor();
});