class Store {
    constructor(initialState) {
      this.state = initialState;
      this.listeners = new Set();
    }
  
    getState() {
      return this.state;
    }
  
    setState(newState) {
      // Merge new properties into current state
      this.state = { ...this.state, ...newState };
      // Notify all subscribers
      this.listeners.forEach(listener => listener(this.state));
    }
  
    subscribe(listener) {
      this.listeners.add(listener);
      
      // Return unsubscribe function
      return () => {
        this.listeners.delete(listener);
      };
    }
  }
  
  // Usage - exactly same as before
  const store = new Store({ count: 0, user: null });
  
  store.subscribe(state => console.log("Counter:", state.count));
  
  store.setState({ count: 1 });  // → Counter: 1
  store.setState({ count: 2 });  // → Counter: 2