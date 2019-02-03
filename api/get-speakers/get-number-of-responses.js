module.exports = ({ questions }) => {
  let number = 0;
  questions.forEach((question) => {
    if (question.status === 'ready') {
      number++;
    }
  });

  return number;
}
