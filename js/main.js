async function loadModel() {
    const model = await tf.loadLayersModel('./model/model.json');
    return model;
}



async function makePrediction() {
    const model = await loadModel();

    console.log('1');
    

    // Collect form data
    const inputs = [
      parseFloat(document.getElementById("time").value),
      parseFloat(document.getElementById("trt").value),
      parseFloat(document.getElementById("age").value),
      parseFloat(document.getElementById("wtkg").value),
      parseFloat(document.getElementById("hemo").value),
      parseFloat(document.getElementById("homo").value),
      parseFloat(document.getElementById("drugs").value),
      parseFloat(document.getElementById("race").value),
      parseFloat(document.getElementById("gender").value),
      parseFloat(document.getElementById("str2").value),
      parseFloat(document.getElementById("treat").value),
      parseFloat(document.getElementById("offtrt").value),
      parseFloat(document.getElementById("cd40").value),
      parseFloat(document.getElementById("cd420").value),
      parseFloat(document.getElementById("cd80").value),
      parseFloat(document.getElementById("cd820").value),
      parseFloat(document.getElementById("karnof").value)
  ];

  console.log(inputs);
  

    // Convert inputs to a tensor and make prediction
    const inputTensor = tf.tensor([inputs]);
    const prediction = model.predict(inputTensor);

    // Display prediction result
    prediction.array().then(pred => {
        document.getElementById("predictionResult").innerText = "Prediction: " + pred[0];
    });
}
