async function loadModel() {
    const model = await tf.loadLayersModel('./model/model.json');
    return model;
}

async function makePrediction() {

    try {
        const model = await loadModel();

        // Collect form data
        const inputs = [
            'trt', 'age', 'wtkg', 'hemo', 'homo', 'drugs',
            'race', 'gender', 'str2', 'treat', 'offtrt', 'cd40',
            'cd420', 'cd80', 'cd820', 'karnof'
        ].map(id => parseFloat(document.getElementById(id).value));


        function normalizeData(inputs) {
            const min = Math.min(...inputs);
            const max = Math.max(...inputs);
            return inputs.map(value => (value - min) / (max - min));
        }

        // Convert inputs to tensor and make prediction
        const normalizedInputs = normalizeData(inputs);
        const inputTensor = tf.tensor([normalizedInputs]);
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
                <p style="font-size: 10px">(Disclaimer: Please note that this model has an accuracy of approximately 70%).</p>
            </div>

        `;

        // Cleanup
        inputTensor.dispose();
        prediction.dispose();

        async function runAllPredictions() {
            const model = await loadModel();
        
            for (let i = 0; i < allInputs.length; i++) {
                const inputTensor = tf.tensor([allInputs[i]]);
                const prediction = model.predict(inputTensor);
                const probabilities = await prediction.data();
                const survivalPercentage = (probabilities[0] * 100).toFixed(2);
                
                predictions.push(survivalPercentage);
                
                // Cleanup
                inputTensor.dispose();
                prediction.dispose();
            }
            
            return predictions;
        }
        
        // Run predictions and log results

        

        runAllPredictions().then(results => {
            console.log('Survival percentages:', results);
            
            // Optional: Display results with row numbers
            results.forEach((prediction, index) => {
                console.log(`Row ${index + 1}: ${prediction}%`);
            });
        });


    } catch (error) {
        console.error('Prediction error:', error);
        document.getElementById("predictionResult").innerHTML = `
            <div class="p-4 bg-red-100 text-red-700">
                Error making prediction. Please check your inputs and try again.
            </div>
        `;
        console.log(inputs);
    }
}