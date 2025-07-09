const setupGeneratorTools = () => {
  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 8);
  };

  const randomHexColor = (): string => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return `#${randomColor.padStart(6, '0')}`;
  };

  return {
    generateId,
    randomHexColor,
  };
}

export const {
  generateId,
  randomHexColor,
} = setupGeneratorTools();

