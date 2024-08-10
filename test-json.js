const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'urls.json');

const readData = () => {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}));
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(DATA_FILE));
  } catch (error) {
    data = {};
  }

  return data;
};

console.log(readData());
