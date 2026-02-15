// Command Design Pattern for Shopping Cart

// Command Interface
class Command {
  execute() {
    throw new Error("execute() must be implemented");
  }
}

// Receiver - The Cart
class Cart {
  constructor() {
    this.items = new Map();
  }

  addItem(productId, name, price, quantity = 1) {
    if (this.items.has(productId)) {
      const item = this.items.get(productId);
      item.quantity += quantity;
    } else {
      this.items.set(productId, { productId, name, price, quantity });
    }
    console.log(`Added ${quantity} x ${name} to cart`);
  }

  removeItem(productId, quantity = 1) {
    if (!this.items.has(productId)) {
      console.log("Item not in cart");
      return false;
    }

    const item = this.items.get(productId);
    if (item.quantity <= quantity) {
      this.items.delete(productId);
      console.log(`Removed ${item.name} from cart`);
    } else {
      item.quantity -= quantity;
      console.log(`Removed ${quantity} x ${item.name} from cart`);
    }
    return true;
  }

  updateQuantity(productId, newQuantity) {
    if (!this.items.has(productId)) {
      console.log("Item not in cart");
      return false;
    }

    const item = this.items.get(productId);
    const oldQuantity = item.quantity;
    item.quantity = newQuantity;
    console.log(`Updated ${item.name} quantity: ${oldQuantity} -> ${newQuantity}`);
    return oldQuantity;
  }

  getTotal() {
    let total = 0;
    this.items.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total;
  }

  display() {
    console.log("\n--- Cart Contents ---");
    if (this.items.size === 0) {
      console.log("Cart is empty");
    } else {
      this.items.forEach((item) => {
        console.log(`${item.name} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`);
      });
      console.log(`Total: $${this.getTotal().toFixed(2)}`);
    }
    console.log("--------------------\n");
  }
}

// Concrete Commands
class AddToCartCommand extends Command {
  constructor(cart, productId, name, price, quantity = 1) {
    super();
    this.cart = cart;
    this.productId = productId;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }

  execute() {
    this.cart.addItem(this.productId, this.name, this.price, this.quantity);
  }
}

class RemoveFromCartCommand extends Command {
  constructor(cart, productId, quantity = 1) {
    super();
    this.cart = cart;
    this.productId = productId;
    this.quantity = quantity;
  }

  execute() {
    this.cart.removeItem(this.productId, this.quantity);
  }
}

class UpdateQuantityCommand extends Command {
  constructor(cart, productId, newQuantity) {
    super();
    this.cart = cart;
    this.productId = productId;
    this.newQuantity = newQuantity;
  }

  execute() {
    this.cart.updateQuantity(this.productId, this.newQuantity);
  }
}

// Invoker - Command Manager
class CartCommandManager {
  constructor(cart) {
    this.cart = cart;
  }

  executeCommand(command) {
    command.execute();
  }
}

// ============ Usage Example ============
console.log("=== Command Pattern - Shopping Cart ===\n");

// Create cart and command manager
const cart = new Cart();
const commandManager = new CartCommandManager(cart);

// Add items to cart
commandManager.executeCommand(new AddToCartCommand(cart, "P001", "iPhone 15", 999, 1));
commandManager.executeCommand(new AddToCartCommand(cart, "P002", "AirPods Pro", 249, 2));
commandManager.executeCommand(new AddToCartCommand(cart, "P003", "MacBook Pro", 1999, 1));

cart.display();

// Update quantity
commandManager.executeCommand(new UpdateQuantityCommand(cart, "P002", 3));
cart.display();

// Remove item
commandManager.executeCommand(new RemoveFromCartCommand(cart, "P001"));
cart.display();

export {
  Command,
  Cart,
  AddToCartCommand,
  RemoveFromCartCommand,
  UpdateQuantityCommand,
  CartCommandManager,
};
