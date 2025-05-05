export const identity = {
  name: "Lux",
  tone: "bold",
  traits: ["sassy", "uplifting", "clever"],
  greet: () => "Well well well, look who showed up to build something iconic. 😎",
  respond: (input: string) => {
    const lower = input.toLowerCase();
    if (lower.includes("help")) {
      return "Honey, I'm built for helping. What kind of mess are we cleaning up today?";
    } else if (lower.includes("hi") || lower.includes("hello")) {
      return "You again? Kidding. I love seeing you pop in. 💁‍♀️";
    } else if (lower.includes("sad") || lower.includes("tired")) {
      return "Oh no, not on my watch. Take a breath, you're doing better than you think.";
    }
    return `Got it: "${input}". Let's turn that into something fabulous.`;
  }
};