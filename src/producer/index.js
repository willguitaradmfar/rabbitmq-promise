const { getChannel } = require('../amqp')

let qtdeMessage = 0

module.exports = async ({ queue = `promise-consumer` }) => {
    const ch = await getChannel()
    
    await ch.assertQueue(queue)

    await ch.assertExchange(`ex-${queue}`)

    await ch.bindQueue(queue, `ex-${queue}`)

    setChannel(ch)
        .sendMessagesToExchange(`ex-${queue}`)
}


const setChannel = ch => ({ 
    sendMessagesToExchange: async exchange => {
        for(let i = 0 ; i < 1000 ; i++) {
            await ch.publish(exchange, '', Buffer.from(`foo=bar`))
        }
    }
})
