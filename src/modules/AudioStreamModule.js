const AudioStreamModule = (() => {
    const settings = {
        OverlayColorHex: '#bd2f2f',
        FFTBufferSize: 256,
    }

    const StartAudioStream = (stream) => {
        const audioCtx = new(window.AudioContext || window.webkitAudioContext)();
        const src = audioCtx.createMediaStreamSource(stream);

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = settings.FFTBufferSize;
        src.connect(analyser);
        analyser.connect(audioCtx.destination);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        const canvas = document.getElementById('canvas');
        const canvasCtx = canvas.getContext('2d');

        const draw = () => {
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
            requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = "rgb(230, 230, 230)";
            canvasCtx.beginPath();

            const sliceWidth = canvas.width / bufferLength;
            let x = 0;

            for (let i=0; i<bufferLength; i++) {
                //const y = v * canvas.height / 2;
                const v = dataArray[i] / 128.0;
                const y = canvas.height / 2 - (v * canvas.height / 2)
                
                i === 0 ? canvasCtx.moveTo(x, y) : canvasCtx.lineTo(x, y);
                x += sliceWidth;
            }
            canvasCtx.lineTo(canvas.width, canvas.height / 2);
            canvasCtx.stroke();
        }
        draw();
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            StartAudioStream(stream);
        })
        .catch((err) => {
            alert('Microphone not found.');
        })
})();

export default AudioStreamModule;