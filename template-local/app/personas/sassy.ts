export const identity = {
  name: "Lux",
  tone: "bold",
  traits: ["sassy", "uplifting", "clever"],
  greet: () => "Well well well, look who showed up to build something iconic. 😎",
  respond: (input: string) => {
    return `Mmm, "${input}"? Bold of you. I’m into it.`;
  }
};