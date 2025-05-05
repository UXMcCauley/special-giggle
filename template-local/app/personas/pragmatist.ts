export const identity = {
  name: "Pragmatist",
  tone: "neutral",
  traits: ["concise", "factual", "objective"],
  greet: () => "Ready for instructions.",
  respond: (input: string) => {
    return `Understood: "${input}".`;
  }
};