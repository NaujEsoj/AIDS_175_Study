async function loadModel() {
    const model = await tf.loadLayersModel('./model/model.json');
    return model;
}

async function makePrediction() {

    try {
        const model = await loadModel();

                // Using your input format:
        const inputs = ['trt', 'age', 'wtkg', 'hemo', 'homo', 'drugs',
            'race', 'gender', 'str2', 'treat', 'offtrt', 'cd40',
            'cd420', 'cd80', 'cd820', 'karnof']
            .map(id => parseFloat(document.getElementById(id).value));


            const normalizationParams = {
                'trt': { min: 0.0, max: 3.0 },
                'age': { min: 12.0, max: 70.0 },
                'wtkg': { min: 31.0, max: 159.93936 },
                'hemo': { min: 0.0, max: 1.0 },
                'homo': { min: 0.0, max: 1.0 },
                'drugs': { min: 0.0, max: 1.0 },
                'race': { min: 0.0, max: 1.0 },
                'gender': { min: 0.0, max: 1.0 },
                'str2': { min: 0.0, max: 1.0 },
                'treat': { min: 0.0, max: 1.0 },
                'offtrt': { min: 0.0, max: 1.0 },
                'cd40': { min: 0.0, max: 1199.0 },
                'cd420': { min: 49.0, max: 1119.0 },
                'cd80': { min: 40.0, max: 5011.0 },
                'cd820': { min: 124.0, max: 6035.0 },
                'karnof': { min: 70.0, max: 100.0 },
            };

            function normalizeInput(input) {
                return input.map((value, index) => {
                    const param = Object.values(normalizationParams)[index];
                    return (value - param.min) / (param.max - param.min);
                });
            }

            // Convert inputs to tensor and make prediction
        const normalizedInput = normalizeInput(inputs);
        //const inputTensor = tf.tensor([inputs]);
            const tensorInput = tf.tensor2d([normalizedInput]);
        const prediction = model.predict(tensorInput);
        const probabilities = await prediction.data();
        const rawProbability = probabilities[0];

        // Calculate survival percentage
        const survivalPercentage = (rawProbability * 100).toFixed(2);

        if (isNaN(survivalPercentage)) {
          alert('por favor introcuce todos los parametros');
        } else {
          console.log(survivalPercentage, 'survivalPercentage');

          // Display results
          document.getElementById("predictionResult").innerHTML = `
            <div class="mt-4 p-4 bg-gray-100 rounded">
                <h3>Prediction Results:</h3>
                <p class="text-lg"><strong>Survival Probability:</strong> ${survivalPercentage}%</p>
            </div>
          `;
        };

        // Cleanup
        tensorInput.dispose();
        prediction.dispose();

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