async function test() {
  try {
    const res = await fetch("http://127.0.0.1:3000/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        question: "Can you explain that more?", 
        language: "en",
        history: [
          { role: "user", parts: [{ text: "What is love?" }] },
          { role: "model", parts: [{ text: JSON.stringify({ answer: "Love is patient, love is kind.", verses: ["1 Corinthians 13:4"] }) }] }
        ]
      })
    });
    const text = await res.text();
    console.log("STATUS:", res.status);
    console.log("BODY:", text);
  } catch (err) {
    console.error(err);
  }
}
test();
