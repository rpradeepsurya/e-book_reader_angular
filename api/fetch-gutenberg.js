const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { path } = req.query;

  try {
    const response = await fetch(`https://www.gutenberg.org/${path}`);
    const data = await response.text();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(data);
  } catch (error) {
    res.status(500).send('Failed to fetch data');
  }
};
