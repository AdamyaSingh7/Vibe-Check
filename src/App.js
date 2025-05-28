import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import confetti from "canvas-confetti";
import "./index.css";
import { motion } from "framer-motion";

const questions = [
  {
    question: "How did you sleep last night?",
    options: ["Like a rock", "Tossed and turned", "Didn’t sleep", "Slept at sunrise"]
  },
  {
    question: "Pick your comfort food:",
    options: ["Pizza", "Ice cream", "Instant noodles", "Avocado toast"]
  },
  {
    question: "What’s your current life soundtrack?",
    options: ["Lo-fi chill beats", "Rock anthems", "Classical piano", "TikTok hits"]
  },
  {
    question: "What’s your red flag?",
    options: ["Overthinker", "Too spontaneous", "Ghosts often", "Too honest"]
  },
  {
    question: "Pick a weekend activity:",
    options: ["Netflix & nap", "Road trip", "Deep clean", "Spontaneous shopping"]
  }
];

const results = {
  Chill: ["Like a rock", "Pizza", "Lo-fi chill beats", "Overthinker", "Netflix & nap"],
  Chaos: ["Didn’t sleep", "Instant noodles", "Rock anthems", "Too spontaneous", "Spontaneous shopping"],
  "Main Character": ["Slept at sunrise", "Avocado toast", "TikTok hits", "Too honest", "Road trip"],
  Zen: ["Tossed and turned", "Ice cream", "Classical piano", "Ghosts often", "Deep clean"]
};

const vibeImages = {
  Chill: "/chill.jpg",
  Chaos: "/chaos.jpeg",
  "Main Character": "/charac.jpg",
  Zen: "/zen.avif"
};

const vibeMusic = {
  Chill: "/chillVibe.mp3",
  Chaos: "/chaosVibe.mp3",
  "Main Character": "/maincharac.mp3",
  Zen: "/zenvibe.mp3"
};


function getResult(answers) {
  let scores = { Chill: 0, Chaos: 0, "Main Character": 0, Zen: 0 };
  for (let answer of answers) {
    for (let vibe in results) {
      if (results[vibe].includes(answer)) scores[vibe]++;
    }
  }
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
}

export default function VibeCheckQuizApp() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [vibe, setVibe] = useState(null);
  const [loading, setLoading] = useState(false);
  const resultRef = useRef(null);

  const handleAnswer = (answer) => {
    const updatedAnswers = [...answers, answer];
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (current < questions.length - 1) {
        setAnswers(updatedAnswers);
        setCurrent(current + 1);
      } else {
        const finalVibe = getResult(updatedAnswers);
        setVibe(finalVibe);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    }, 500);
  };

  const shareResult = () => {
  let resultText = `✨ Your Vibe Check Result ✨\n\n`;

  questions.forEach((q, idx) => {
    resultText += `Q${idx + 1}: ${q.question}\n`;
    resultText += `Your Answer: ${answers[idx]}\n\n`;
  });

  resultText += `Final Vibe: ${vibe} 🎉\n`;

  const blob = new Blob([resultText], { type: "text/plain" });
  const link = document.createElement("a");
  link.download = "vibe-check-result.txt";
  link.href = URL.createObjectURL(blob);
  link.click();
};

  if (vibe) {
    return (
      <div ref={resultRef} className="vibe-result">
        <audio autoPlay loop src={vibeMusic[vibe]} />
        <h1>You got: {vibe} ✨</h1>
        <img src={vibeImages[vibe]} alt={vibe} />
        <p>Your vibe has been officially checked. Share it with your friends!</p>
        <div className="vibe-buttons">
          <button className="vibe-download" onClick={shareResult}>
            Download Result 🎉
          </button>
          <a
            className="vibe-share"
            href={`https://twitter.com/intent/tweet?text=I got the ${vibe} vibe! Check yours here: ${window.location.href}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Share on Twitter/X
          </a>
        </div>
        <button className="vibe-retake" onClick={() => window.location.reload()}>
          Retake Quiz 🔁
        </button>
      </div>
    );
  }


 return (
  <div className="vibe-container">
    {loading ? (
      <div className="vibe-loading">Vibe loading...</div>
    ) : (
      <>
        <h1 className="animated-vibe-check">VIBE CHECK</h1>
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="vibe-question">{questions[current].question}</h2>
          <div>
            {questions[current].options.map((option, idx) => (
              <button
                key={idx}
                className="vibe-option"
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </motion.div>
      </>
    )}
  </div>
);
}
