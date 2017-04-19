import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws'

const wsClient = new SubscriptionClient('wss://subscriptions.graph.cool/v1/cj1132nbg4pwk0138d8ummhiq', {
  reconnect: true,
/*  connectionParams: {
    authToken: user.authToken,
  }, */
})

const networkInterface = createNetworkInterface({
  uri: 'https://api.graph.cool/simple/v1/cj1132nbg4pwk0138d8ummhiq',
  dataIdFromObject: record => record.id,
})

networkInterface.use([{
  applyMiddleware(req, next) {
    if (localStorage.getItem('auth0IdToken')) {
      if (!req.options.headers) {
        req.options.headers = {}
      }
      req.options.headers.authorization =
        `Bearer ${localStorage.getItem('auth0IdToken')}`
    }
    next()
  },
}])

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
)

export const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
})
