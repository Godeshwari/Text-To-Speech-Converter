const speech = new SpeechSynthesisUtterance();
const voiceSelect = document.querySelector("select");
let voices = [];

// Show "Loading..." initially
voiceSelect.innerHTML = '<option>Loading voices...</option>';
voiceSelect.disabled = true;

// Load voices AFTER the page and user interaction
document.addEventListener("DOMContentLoaded", () => {
  // Chrome sometimes blocks voices until user interacts
  document.body.addEventListener("click", initializeVoices, { once: true });
});

function initializeVoices() {
  loadVoices();
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
  }
}

function loadVoices() {
  voices = speechSynthesis.getVoices();

  if (voices.length === 0) {
    // Retry until voices are available
    setTimeout(loadVoices, 250);
    return;
  }

  // Populate dropdown
  voiceSelect.innerHTML = "";
  voices.forEach((voice, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });

  voiceSelect.disabled = false;
  speech.voice = voices[0];
  console.log("✅ Voices loaded:", voices);
}

// Change voice selection
voiceSelect.addEventListener("change", () => {
  speech.voice = voices[voiceSelect.value];
});

// Speak text
document.querySelector("button").addEventListener("click", () => {
  const text = document.querySelector("textarea").value.trim();

  if (!text) {
    alert("Please enter text to speak!");
    return;
  }

  speech.text = text;
  speech.rate = 1;
  speech.pitch = 1;
  speech.volume = 1;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(speech);
});
