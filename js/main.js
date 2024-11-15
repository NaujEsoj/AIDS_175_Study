async function loadModel() {
    const model = await tf.loadLayersModel('./model/model.json');
    return model;
}

async function makePrediction() {
    try {
        const model = await loadModel();

        // Collect form data
        const inputs = [
            'time', 'trt', 'age', 'wtkg', 'hemo', 'homo', 'drugs',
            'race', 'gender', 'str2', 'treat', 'offtrt', 'cd40',
            'cd420', 'cd80', 'cd820', 'karnof'
        ].map(id => parseFloat(document.getElementById(id).value));

        // Convert inputs to tensor and make prediction
        const inputTensor = tf.tensor([inputs]);
        const prediction = model.predict(inputTensor);
        const probabilities = await prediction.data();
        const rawProbability = probabilities[0];

        // Calculate survival percentage
        const survivalPercentage = (rawProbability * 100).toFixed(2);

        // Display results
        document.getElementById("predictionResult").innerHTML = `
            <div class="mt-4 p-4 bg-gray-100 rounded">
                <h3>Prediction Results:</h3>
                <p class="text-lg"><strong>Survival Probability:</strong> ${survivalPercentage}%</p>
            </div>
        `;

        // Cleanup
        inputTensor.dispose();
        prediction.dispose();

    } catch (error) {
        console.error('Prediction error:', error);
        document.getElementById("predictionResult").innerHTML = `
            <div class="p-4 bg-red-100 text-red-700">
                Error making prediction. Please check your inputs and try again.
            </div>
        `;
    }
}