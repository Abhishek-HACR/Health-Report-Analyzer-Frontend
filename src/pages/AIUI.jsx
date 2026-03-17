import React, { useState, useEffect } from "react";
import "./AIUI.css"

const AIUI = () => {

const [file, setFile] = useState(null);
const [analysis, setAnalysis] = useState("Waiting for report...");
const [question, setQuestion] = useState("");
// const [answer, setAnswer] = useState("");
const [displayAnswer, setDisplayAnswer] = useState("");
const [reportText, setReportText] = useState("");

const titles = [
"How can I help you understand your medical report?",
"Ask me anything about your health report",
"What would you like to know about your report today?",
"Need help reading your medical report?",
"Let's analyze your health report together",
"Ask anything about your medical data",
"Your AI medical assistant is ready",
"How can I assist you with your report today?"
];

const [displayTitle, setDisplayTitle] = useState("");

useEffect(() => {

let titleIndex = Math.floor(Math.random() * titles.length);
let text = titles[titleIndex];
let i = 0;
let timeout;

function typeEffect(){
if(i <= text.length){
setDisplayTitle(text.slice(0, i));
i++;
timeout = setTimeout(typeEffect,40);
}
}

typeEffect();

return () => clearTimeout(timeout);

}, []);

const uploadFile = async () => {

if (!file) {
alert("Please select a PDF file first");
return;
}

document.getElementById("loader").style.display = "block";

let formData = new FormData();
formData.append("file", file);

let response = await fetch("http://127.0.0.1:5000/analyze", {
method: "POST",
body: formData
});

let data = await response.json();

setAnalysis(data.analysis);
setReportText(data.report_text);

document.getElementById("loader").style.display = "none";

};

const askAI = async () => {

let response = await fetch("http://127.0.0.1:5000/chat", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
question: question,
report: reportText
})
});

let data = await response.json();

setDisplayAnswer(""); // reset

let text = data.answer || "No response from AI";
let i = 0;

function typeEffect(){
if(i <= text.length){
setDisplayAnswer(text.slice(0, i));
i++;
setTimeout(typeEffect, 15);
}
}

typeEffect();

setQuestion("");
};

const handleKeyDown = (event) => {
if (event.key === "Enter") {
event.preventDefault();
askAI();
}
};

return (

<div className="container">

<header>
<h1><i className="fa-solid fa-heart-pulse"></i> AI Medical Report Analyzer</h1>
</header>

<div className="section">

<h3>Upload Medical Report</h3>

<div className="upload-box">

<input
type="file"
id="fileInput"
accept=".pdf"
onChange={(e) => setFile(e.target.files[0])}
/>

<br/><br/>

<button onClick={uploadFile}>
<i className="fa-solid fa-file-medical"></i> Analyze Report
</button>

<div className="loader" id="loader">
<div className="spinner"></div>
</div>

</div>

</div>

<div className="section">

<h3>Analysis Result</h3>

<div className="result-box">
<pre id="result">{analysis}</pre>
</div>

</div>

<div className="section">

<h2 id="chatTitle">{displayTitle}</h2>

<div className="chat-box">

<input
type="text"
id="question"
placeholder="Ask something about your report..."
value={question}
onChange={(e) => setQuestion(e.target.value)}
onKeyDown={handleKeyDown}
/>

<button onClick={askAI}>
<i className="fa-solid fa-robot"></i> Ask
</button>

</div>

<div id="answer">{displayAnswer}</div>

</div>

<footer>
AI Powered Medical Report Analyzer
</footer>

</div>

);

};

export default AIUI;