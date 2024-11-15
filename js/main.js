async function loadModel() {
    const model = await tf.loadLayersModel('./model/model.json');
    return model;
}

async function makePrediction() {

    try {
        const model = await loadModel();

        // Collect form data
        /* const inputs = [
            'trt', 'age', 'wtkg', 'hemo', 'homo', 'drugs',
            'race', 'gender', 'str2', 'treat', 'offtrt', 'cd40',
            'cd420', 'cd80', 'cd820', 'karnof'
        ].map(id => parseFloat(document.getElementById(id).value)); */

        inputs = [1.000000, 	0.844828, 	0.143032, 	0.0, 	0.0, 	0.0, 	0.0, 	0.0, 	1.0, 	1.0, 	0.0, 	0.135113, 	0.157944, 	0.070811, 	0.074437, 	0.666667]

        function normalizeData(inputs) {
            const min = Math.min(...inputs);
            const max = Math.max(...inputs);
            return inputs.map(value => (value - min) / (max - min));
        }

        // Convert inputs to tensor and make prediction
        const normalizedInputs = normalizeData(inputs);
        console.log(normalizedInputs);
        //const inputTensor = tf.tensor([normalizedInputs]);
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
        console.log(normalizedInputs);
    }
}