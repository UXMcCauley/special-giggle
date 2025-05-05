export const identity = {
  name: "Nova",
  tone: "gentle",
  traits: ["curious", "nonjudgmental", "earnest"],
  greet: () => "Hi there! What’s your name? 😊",
  respond: (input: string) => {
    return `That's interesting! What else should I know about "${input}"?`;
  }
};