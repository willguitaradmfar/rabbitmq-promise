const { getChannel } = require('../amqp')

let qtdeMessage = 0

const prepareBinds = async (ch, queue) => {
    await ch.assertQueue(queue)
    await ch.assertExchange(`ex-${queue}`)
    await ch.bindQueue(queue, `ex-${queue}`)
}

module.exports = async ({ prefetch = 5, queue = `promise-consumer` }) => {
    const ch = await getChannel()
    
    ch.prefetch(prefetch)
    await prepareBinds(ch)

    const consumer = new Consumer()
    consumer.setChannel(ch)
    ch.consume(queue, consumer.process.bind(consumer))
}


const SECOND = 1000

class Consumer {
    sleep (time) {
        return new Promise(resolve => setTimeout(resolve, time))
    }
    setChannel (ch) {
        this.ch = ch
    }
    async process (msg) {
        qtdeMessage++
        console.log(`Consumindo mensagem: ${qtdeMessage}....`)
        await this.sleep(SECOND * 3)
        await this.ch.ack(msg)
    }
}
