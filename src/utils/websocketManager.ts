type WebSocketHandlers = {
  [url: string]: {
    socket: WebSocket | null;
    handlers: Set<(data: any) => void>;
    subscriptions: Map<string, any>; // Stores subscriptions per WebSocket for tracking
  };
};

export const websocketManager = (() => {
  const sockets: WebSocketHandlers = {};

  /**
   * Get an existing WebSocket connection for the given URL.
   */
  const getSocket = (url: string): WebSocket | null => {
    return sockets[url]?.socket || null;
  };

  /**
   * Create a new WebSocket connection for the given URL.
   */
  const createSocket = (url: string): WebSocket => {
    if (!sockets[url]) {
      sockets[url] = {
        socket: null,
        handlers: new Set(),
        subscriptions: new Map(),
      };
    }

    if (sockets[url].socket === null) {
      const socket = new WebSocket(url);

      socket.onopen = () => {
        console.log(`[WebSocketManager] Connected to ${url}`);
        // Resend all subscriptions on reconnect
        sockets[url].subscriptions.forEach((message) => {
          socket.send(JSON.stringify(message));
        });
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(`[WebSocketManager] Received message from ${url}:`, data);
        sockets[url]?.handlers.forEach((handler) => handler(data));
      };

      socket.onclose = () => {
        console.log(`[WebSocketManager] Connection to ${url} closed`);
        sockets[url].socket = null;
      };

      socket.onerror = (error) => {
        console.error(`[WebSocketManager] Error on WebSocket for ${url}:`, error);
        sockets[url].socket = null;
      };

      sockets[url].socket = socket;
    }

    return sockets[url].socket!;
  };

  /**
   * Subscribe to WebSocket updates for the given URL.
   */
  const subscribe = (url: string, handler: (data: any) => void) => {
    if (!sockets[url]) {
      createSocket(url);
    }

    sockets[url].handlers.add(handler);
    console.log(`[WebSocketManager] Subscribed to updates for ${url}`);
  };

  /**
   * Unsubscribe from WebSocket updates for the given URL.
   */
  const unsubscribe = (url: string, handler: (data: any) => void) => {
    if (sockets[url]) {
      sockets[url].handlers.delete(handler);
      console.log(`[WebSocketManager] Unsubscribed from updates for ${url}`);
    }
  };

  /**
   * Send a message through the WebSocket connection for the given URL.
   * Also tracks the subscription for reconnect scenarios.
   */
  const send = (url: string, message: any) => {
    const socket = getSocket(url);
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
      console.log(`[WebSocketManager] Sent message to ${url}:`, message);
    } else {
      console.error(`[WebSocketManager] Cannot send message. WebSocket is not open for ${url}`);
    }

    // Track the subscription to ensure resending on reconnect
    if (sockets[url]) {
      const subscriptionKey = JSON.stringify(message);
      sockets[url].subscriptions.set(subscriptionKey, message);
    }
  };

  /**
   * Remove a tracked subscription.
   */
  const removeSubscription = (url: string, message: any) => {
    if (sockets[url]) {
      const subscriptionKey = JSON.stringify(message);
      sockets[url].subscriptions.delete(subscriptionKey);
      console.log(`[WebSocketManager] Removed subscription for ${url}:`, message);
    }
  };

  return {
    getSocket,
    createSocket,
    subscribe,
    unsubscribe,
    send,
    removeSubscription,
  };
})();