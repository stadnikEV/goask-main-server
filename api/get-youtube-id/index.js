module.exports = (req, res) => {
  const question = res.locals.question;

  res.json({
    youtubeId: question.statusVideo.id,
  });
};
