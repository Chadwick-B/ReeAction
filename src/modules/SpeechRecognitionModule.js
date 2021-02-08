const SpeechRecognitionModule = (() => {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.interimResults = true;

    const captions = document.getElementById('overlay');
    recognition.addEventListener('result', (e) => {
        const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('')
        
        captions.textContent = transcript;
        if (e.results[0].isFinal) {
            console.log('a');
        }
    });

    recognition.addEventListener('end', recognition.start);
    recognition.start();
})();

export default SpeechRecognitionModule;