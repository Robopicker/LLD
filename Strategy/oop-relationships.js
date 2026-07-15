// ============================================================
// OOP RELATIONSHIPS: Abstract, Implementation, Composition, Aggregation
// ============================================================


// ─────────────────────────────────────────────────────────────
// 0. ABSTRACT CLASSES
// ─────────────────────────────────────────────────────────────
// A class that CANNOT be instantiated directly — exists only to
// be extended. It defines a contract (abstract methods) that all
// subclasses MUST implement.
//
// JS has no native `abstract` keyword, so we simulate it with:
//   • new.target check in constructor → blocks direct instantiation
//   • throw in unimplemented methods  → forces subclass override

class AbstractAnimal {
  constructor() {
    if (new.target === AbstractAnimal) {
      throw new Error("Cannot instantiate abstract class AbstractAnimal");
    }
  }

  // Abstract method — subclasses must override this
  speak() {
    throw new Error("speak() must be implemented by subclass");
  }

  // Concrete method — shared logic available to all subclasses
  breathe() {
    console.log("Breathing...");
  }
}

class Dog extends AbstractAnimal {
  speak() {
    console.log("Woof!");
  }
}

class Cat extends AbstractAnimal {
  speak() {
    console.log("Meow!");
  }
}

// new AbstractAnimal(); // ❌ Error: Cannot instantiate abstract class
const dog = new Dog();
dog.speak();    // Woof!
dog.breathe();  // Breathing... (inherited concrete method)

// Key traits of abstract classes:
//   ✅ Can have concrete methods (shared logic)
//   ✅ Can have abstract methods (enforced contract)
//   ❌ Cannot be instantiated directly
//   ✅ Must be extended — subclass provides the missing pieces
//
// 👉 Use cases:
//   • Shape → Circle, Rectangle (force area() implementation)
//   • DataStore → MySQLStore, RedisStore
//   • AbstractHandler in Chain of Responsibility pattern


// ─────────────────────────────────────────────────────────────
// 1. ABSTRACTION
// ─────────────────────────────────────────────────────────────
// Hiding internal details, exposing only what's necessary.
// "What it does" — not "how it does it".
//
// Abstract classes are the primary tool for abstraction in OOP.
// In JS, abstraction is achieved via:
//   • Abstract classes (new.target guard + throw on abstract methods)
//   • Interfaces simulated with duck typing

class PaymentProcessor {
  constructor() {
    if (new.target === PaymentProcessor) {
      throw new Error("Cannot instantiate abstract class PaymentProcessor");
    }
  }

  pay(amount) {
    throw new Error("pay() must be implemented by subclass");
  }
}

// Consumer only knows about .pay() — doesn't care about internals
// 👉 Use case: payment providers, logger, storage drivers

// ─────────────────────────────────────────────────────────────
// 2. IMPLEMENTATION (Inheritance)
// ─────────────────────────────────────────────────────────────
// A subclass fulfills the contract defined by a parent/abstract class.
// "IS-A" relationship.

class StripePayment extends PaymentProcessor {
  pay(amount) {
    console.log(`Paying ₹${amount} via Stripe`);
    // Stripe-specific logic here
  }
}

class UPIPayment extends PaymentProcessor {
  pay(amount) {
    console.log(`Paying ₹${amount} via UPI`);
    // UPI-specific logic here
  }
}

const payment = new StripePayment();
payment.pay(500); // Paying ₹500 via Stripe

// 👉 Use cases:
//   • PaymentProcessor → StripePayment, UPIPayment
//   • Logger → ConsoleLogger, FileLogger
//   • Component → Button, Input, Modal


// ─────────────────────────────────────────────────────────────
// 3. COMPOSITION
// ─────────────────────────────────────────────────────────────
// A class is built FROM other objects.
// "HAS-A" relationship — strong ownership.
// Child CANNOT exist without the parent (lifecycle is shared).

class Engine {
  start() {
    console.log("Engine started");
  }
}

class Car {
  constructor() {
    this.engine = new Engine(); // Car OWNS Engine — created internally
  }

  drive() {
    this.engine.start();
    console.log("Car is moving");
  }
}

const car = new Car();
car.drive();
// If Car is destroyed → Engine is destroyed too

// 👉 Use cases:
//   • Order has OrderItems (items don't exist outside an order)
//   • House has Rooms
//   • Form has FormFields


// ─────────────────────────────────────────────────────────────
// 4. AGGREGATION
// ─────────────────────────────────────────────────────────────
// A class REFERENCES other objects passed from outside.
// "HAS-A" relationship — weak ownership.
// Child CAN exist independently of the parent.

class Driver {
  constructor(name) {
    this.name = name;
  }
}

class Taxi {
  constructor(driver) {
    this.driver = driver; // Taxi uses Driver — but doesn't own it
  }

  info() {
    console.log(`Taxi driven by ${this.driver.name}`);
  }
}

const driver = new Driver("Ravi");
const taxi = new Taxi(driver);
taxi.info();
// If Taxi is destroyed → Driver still exists

// 👉 Use cases:
//   • Team has Members (members exist outside the team)
//   • Course has Students
//   • Library has Books


// ─────────────────────────────────────────────────────────────
// QUICK COMPARISON
// ─────────────────────────────────────────────────────────────
//
//  Concept         | Keyword            | Relationship  | Key Trait
// ──────────────────────────────────────────────────────────────────────────────
//  Abstract Class  | new.target guard   | blueprint     | cannot instantiate; mix of concrete + abstract methods
//  Abstraction     | base class / throw | contract      | hides internals; exposes only the interface
//  Implementation  | extends            | IS-A          | subclass fulfills all abstract methods of parent
//  Composition     | new inside ctor    | HAS-A (owns)  | child object dies with parent
//  Aggregation     | passed in ctor     | HAS-A (uses)  | child lives independently of parent
// ──────────────────────────────────────────────────────────────────────────────
//
//  Abstract class vs plain base class:
//   • Plain base class  → CAN be instantiated directly (no guard)
//   • Abstract class    → CANNOT be instantiated; enforces subclassing
//   Both use `extends` for inheritance.


// ─────────────────────────────────────────────────────────────
// REAL-WORLD EXAMPLE (combining all 4)
// ─────────────────────────────────────────────────────────────

// Abstraction — define the contract
class NotificationService {
  send(message) {
    throw new Error("send() must be implemented");
  }
}

// Implementation — fulfill the contract
class EmailNotification extends NotificationService {
  send(message) {
    console.log(`Email: ${message}`);
  }
}

class SMSNotification extends NotificationService {
  send(message) {
    console.log(`SMS: ${message}`);
  }
}

// Composition — Logger is created and owned by OrderService
class Logger {
  log(text) {
    console.log(`[LOG] ${text}`);
  }
}

// Aggregation — NotificationService is passed in from outside
class OrderService {
  constructor(notifier) {
    this.notifier = notifier;         // Aggregation (passed in)
    this.logger = new Logger();       // Composition (created internally)
  }

  placeOrder(item) {
    this.logger.log(`Order placed: ${item}`);
    this.notifier.send(`Your order for ${item} is confirmed!`);
  }
}

const notifier = new EmailNotification();
const orderService = new OrderService(notifier);
orderService.placeOrder("Burger");

// [LOG] Order placed: Burger
// Email: Your order for Burger is confirmed!
