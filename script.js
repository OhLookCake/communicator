// Helper function to generate a color based on the seed
function generateColor(seed) {
    const hash = [...seed.toString()].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const randomValue = (hash * 16807) % 256;
    return `rgb(${randomValue}, ${Math.abs((randomValue + 50) % 256)}, ${Math.abs((randomValue + 100) % 256)})`;
}

// Function to generate slight variations of the color
function generateColorVariation(baseColor, variation) {
    const rgb = baseColor.match(/\d+/g).map(Number);
    return `rgb(${(rgb[0] + variation) % 256}, ${(rgb[1] + variation) % 256}, ${(rgb[2] + variation) % 256})`;
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
