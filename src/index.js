require('dotenv').config()
const app = require(`./${process.argv[2]}`)

const options = {
    prefetch: 5,
    queue: `promise-consumer`
}

app(options)
    .catch(err => console.error(err))