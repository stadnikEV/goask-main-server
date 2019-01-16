var readline = require('readline');

module.exports = ({ youtubeClient, scope }) => {
  const promise = new Promise((resolve) => {
    var authUrl = youtubeClient.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope,
    });

    console.log('Authorize this app by visiting this url: ', authUrl);

    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Enter the code from that page here: ', function(code) {
      rl.close();
      resolve(code);
    });
  });

  return promise;
};
