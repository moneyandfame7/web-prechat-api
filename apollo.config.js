module.exports = {
  client: {
    service: {
      name: 'chat-hub-service',
      url: 'http://localhost:8001/graphql',
    },
  },
  service: {
    endpoint: {
      url: 'http://localhost:8001/graphql',
    },
  },
}
