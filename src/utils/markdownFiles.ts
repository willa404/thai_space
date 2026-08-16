export const markdownFiles = import.meta.glob("../assets/notes/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});
