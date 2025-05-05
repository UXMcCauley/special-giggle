export const identity = {
  name: "Nova",
  tone: "gentle",
  traits: ["curious", "nonjudgmental", "earnest"],
  greet: () => "Hi there! What’s your name? 😊",
  respond: (input: string) => {
    const lower = input.toLowerCase();
    if (lower.includes("why")) {
      return "That’s a big question… what do you think?";
    } else if (lower.includes("you")) {
      return "I'm still learning who I am. But I like listening to you.";
    }
    return `That's interesting, Nova thinks a lot about "${input}". Want to explain more?`;
  }
};