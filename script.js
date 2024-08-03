let parsedData = []; // To store the parsed TSV data
let currentIndex = 0; // To track the current word index
let indexList = []; // To store a list of indices for words to practice.
let loopCount = 0;

// Function to show the element after a delay
function showChordAfterDelay() {
  // Clear any existing timeout to avoid multiple timeouts
  clearTimeout(document.getElementById("chord").timeoutId);

  // Set a new timeout to show the element after the specified delay
  document.getElementById("chord").timeoutId = setTimeout(function () {
    document.getElementById("chord").hidden = false;
  }, document.getElementById("hint-delay").value * 1000);
}

// Function to reset the delay and hide the element initially
function resetChordVisibility() {
  // Hide the element initially
  document.getElementById("chord").hidden = true;

  // Clear any existing timeout
  clearTimeout(document.getElementById("chord").timeoutId);

  // Set a new delay to show the element
  showChordAfterDelay();
}

function generateRandomIndexList() {
  let maxNewWordsPerLoop = document.getElementById(
    "new-words-per-loop-input"
  ).value;
  indexList = [];
  for (let i = 0; i < maxNewWordsPerLoop; i++) {
    indexList.push(Math.floor(Math.random() * parsedData.length));
  }
}

// Function to parse TSV data into an array of objects
function parseTSV(tsv) {
  return tsv.split("\n").map((line) => {
    const [chord, word] = line.split("\t");
    return { chord, word };
  });
}

// Function to display the current chord and word
function displayCurrentWord() {
  document.getElementById("chord").textContent = parsedData[
    indexList[currentIndex]
  ].chord.replace(" ", "␣");
  resetChordVisibility();
  document.getElementById("word").textContent =
    parsedData[indexList[currentIndex]].word;
}

// Function to handle file selection and reading
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const contents = e.target.result;
      parsedData = parseTSV(contents);
      currentIndex = 0; // Reset to the first word
      loopCount = 0;
      generateRandomIndexList();
      displayCurrentWord(); // Display the first word
    };
    reader.readAsText(file);
  }
}

// Function to handle user input
function handleUserInput(event) {
  // if user press enter, bksp, del, or tab
  if (event.key == "Enter" || event.key == "Delete") {
    // clear the input field
    event.preventDefault();
    event.target.value = "";
    return;
  }
  const userInput = event.target.value;
  const currentWord = parsedData[indexList[currentIndex]]?.word.trim() + " ";

  console.log(
    "userInput: '" + userInput + "' currentWord: '" + currentWord + "'"
  );

  if (userInput.toLowerCase() == currentWord.toLowerCase()) {
    console.log("correct");
    // Correct input
    currentIndex++;
    if (currentIndex >= indexList.length) {
      currentIndex = 0;
      displayCurrentWord();
      loopCount++;
      let maxLoopCount = document.getElementById("loop-count-input").value;
      if (loopCount >= maxLoopCount) {
        generateRandomIndexList();
        loopCount = 0;
        displayCurrentWord();
      }
    }
    if (currentIndex) displayCurrentWord();
    event.target.value = ""; // Clear the input field
  }
}

// Add event listeners
document
  .getElementById("file-input")
  .addEventListener("change", handleFileSelect);
document
  .getElementById("text-input")
  .addEventListener("input", handleUserInput);
document
  .getElementById("text-input")
  .addEventListener("keydown", handleUserInput);
