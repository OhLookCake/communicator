// Helper function to convert HSV to RGB
function hsvToRgb(h, s, v) {
    let f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
    return `rgb(${Math.round(f(5) * 255)}, ${Math.round(f(3) * 255)}, ${Math.round(f(1) * 255)})`;
}

// Helper function to generate a color based on the seed (in HSV)
function generateColor(seed) {
    const hash = [...seed.toString()].reduce((acc, char) => acc + char.charCodeAt(0), 0);

    const hue = (hash * 117) % 360; // Hue between 0-360
    const saturation = 0.8; // Fixed saturation of 80%
    const value = 0.8; // Fixed brightness of 80%

    return hsvToRgb(hue, saturation, value);
}

// Function to generate slight variations of the color in HSV
function generateColorVariation(baseColor, variation) {
    const rgb = baseColor.match(/\d+/g).map(Number);
    let [r, g, b] = rgb;

    // Convert RGB to HSV for modification
    let { h, s, v } = rgbToHsv(r, g, b);

    // Slightly adjust the hue for variation
    h = (h + variation) % 360;

    return hsvToRgb(h, s, v);
}

// Convert RGB to HSV (needed for generating variations)
function rgbToHsv(r, g, b) {
    (r /= 255), (g /= 255), (b /= 255);
    let max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h,
        s,
        v = max;
    let d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    return { h: h * 360, s, v };
}

// Function for Cluer to show the true color
function showCluerColor(seed) {
    const trueColor = generateColor(seed);
    const svg = document.querySelector("#trueColor");
    svg.style.fill = trueColor;
}

// Function for Guesser to show 4 color options
function showGuesserColors(seed) {
    resetGuesser(); // Reset the page when a new seed is entered

    const trueColor = generateColor(seed);
    const colorOptions = [trueColor];

    // Generate 3 more variations
    for (let i = 1; i <= 3; i++) {
        colorOptions.push(generateColorVariation(trueColor, i * 15));
    }

    // Shuffle the options
    colorOptions.sort(() => Math.random() - 0.5);

    // Display the colors in the SVGs
    const svgs = document.querySelectorAll("svg");
    svgs.forEach((svg, index) => {
        svg.style.fill = colorOptions[index];
        svg.onclick = () => {
            const resultElement = document.getElementById("result");
            if (colorOptions[index] === trueColor) {
                resultElement.textContent = "Correct!";
                resultElement.style.color = "green";
            } else {
                resultElement.textContent = "Incorrect!";
                resultElement.style.color = "red";
            }

            // Highlight the correct color
            const correctIndex = colorOptions.indexOf(trueColor);
            svgs.forEach((s) => (s.style.border = "none")); // Remove borders from all
            svgs[correctIndex].style.border = "5px solid green"; // Highlight the correct one
        };
    });
}

// Function to reset the page elements (remove highlights, hide messages)
function resetGuesser() {
    const svgs = document.querySelectorAll("svg");
    svgs.forEach((svg) => {
        svg.style.border = "none"; // Remove borders
    });

    document.getElementById("result").textContent = ""; // Hide result message
}
