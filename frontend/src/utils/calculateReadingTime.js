const calculateReadingTime = (content) => {
  const wordsPerMinute = 200;
  const totalWords = content?.split(" ");
  const minutes = totalWords?.length / wordsPerMinute;
  const readTime = Math.ceil(minutes);
  return readTime;
};
export default calculateReadingTime;
