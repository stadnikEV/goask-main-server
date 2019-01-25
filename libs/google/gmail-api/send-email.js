const {google} = require('googleapis');
const base64url = require('base64url');

module.exports = ({
  oauthGoogle,
  to,
  theme,
  body,
 }) => {
  const promise = new Promise((resolve, reject) => {
    const gmail = google.gmail({version: 'v1', auth: oauthGoogle });

    const buff = Buffer.from(`${theme}`, 'utf8');
    let base64 = buff.toString('base64');

    let email = [
      "MIME-Version: 1.0\n",
      "Content-Transfer-Encoding: 7bit\n",
      'Content-Type: text/plain; charset="UTF-8"\n',
      'to: ', `${to}`, '\n',
      'from: ', 'goaskonline@gmail.com', '\n',
      'subject: ', `=?UTF-8?B?${base64}?=`, '\n\n',
      "message: ", `${body}`, "\n",
    ]
      .join('');

    email = base64url(email, 'utf8');
    gmail.users.messages.send({
      userId: 'me',
      'resource': {
        'raw': email,
      },
    }, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });

  return promise;
}
