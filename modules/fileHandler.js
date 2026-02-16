const fs = require('fs').promises
const FILE_PATH = './employees.json'

async function read() {
  try {
    const data = await fs.readFile(FILE_PATH, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    console.log("Error reading file:", err)
    return []
  }
}

async function write(data) {
  try {
    await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2))
  } catch (err) {
    console.log("Error writing file:", err)
  }
}

module.exports = { read, write }