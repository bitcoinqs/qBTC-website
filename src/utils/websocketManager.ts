type WebSocketHandlers = {
  [url: string]: {
    socket: WebSocket | null;
    handlers: Set<(data: any) => void>;
    subscriptions: Map<string, any>; // Tracks subscriptions to resend on reconnect
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

      socket.onclose = (event) => {
        console.log(`[WebSocketManager] Connection to ${url} closed. Code: ${event.code}`);
        sockets[url].socket = null;
        if (event.code !== 1000) {
          console.log(`[WebSocketManager] Reconnecting to ${url} in 5 seconds...`);
          setTimeout(() => createSocket(url), 5000); // Reconnect after 5 seconds
        }
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
    const messageString = JSON.stringify(message);

    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(messageString);
      console.log(`[WebSocketManager] Sent message to ${url}:`, message);
    } else {
      console.warn(`[WebSocketManager] WebSocket is not open. Message not sent:`, message);
    }

    // Track the subscription to ensure it can be resent on reconnect
    if (sockets[url]) {
      sockets[url].subscriptions.set(messageString, message);
    }
  };

  /**
   * Remove a tracked subscription.
   */
  const removeSubscription = (url: string, message: any) => {
    if (sockets[url]) {
      const messageString = JSON.stringify(message);
      sockets[url].subscriptions.delete(messageString);
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