/**
 * ============================================================================
 * DECORATOR PATTERN
 * ============================================================================
 *
 * DEFINITION:
 * The Decorator Pattern attaches additional responsibilities to an object
 * dynamically. It provides a flexible alternative to subclassing for
 * extending functionality.
 *
 * WHEN TO USE:
 * - When you want to add features to objects without modifying their class
 * - When subclassing would lead to an explosion of classes (e.g., MilkCoffee, SugarCoffee, MilkSugarCoffee...)
 * - When you need to add/remove features at runtime
 * - When you want to combine multiple behaviors flexibly
 *
 * KEY COMPONENTS:
 * 1. Component Interface - defines the interface for objects (getCost, getDescription)
 * 2. Concrete Component  - the base object to be decorated (Coffee)
 * 3. Decorator           - wraps the component and adds behavior (ColdCoffeeDecorator, SugarDecorator)
 *
 * THE KEY INSIGHT:
 * - Decorators have the SAME interface as the component they wrap
 * - This allows decorators to wrap other decorators (stacking)
 * - Each decorator calls the wrapped object's method + adds its own behavior
 *
 * DECORATOR vs INHERITANCE:
 * - Inheritance: Static, defined at compile time, one parent
 * - Decorator: Dynamic, can stack multiple behaviors at runtime
 *
 * REAL-WORLD EXAMPLES:
 * - Coffee shop orders (this example)
 * - I/O streams (BufferedReader wrapping FileReader)
 * - Middleware in Express.js
 * - Higher-Order Components (HOC) in React
 * - Text formatting (bold, italic, underline)
 *
 * ============================================================================
 */

// ============================================================================
// COMPONENT (Base class)
// ============================================================================
// The base object that can be decorated

class Coffee {
    getCost() { return 50 }
    getDescription() { return "Simple Coffee" }
}

// ============================================================================
// DECORATORS
// ============================================================================
// Each decorator wraps a coffee object and adds its own behavior
// Notice: Decorators have the SAME methods as Coffee (getCost, getDescription)

// Cold Coffee decorator - adds ₹10 for making it cold
class ColdCoffeeDecorator {
    constructor(coffee) {
        this.coffee = coffee;  // Wrap the coffee object
    }
    getCost() {
        return this.coffee.getCost() + 10;  // Original cost + cold coffee charge
    }
    getDescription() {
        return this.coffee.getDescription() + ", Cold";
    }
}

// Sugar decorator - adds ₹10 for extra sugar
class SugarDecorator {
    constructor(coffee) {
        this.coffee = coffee;  // Wrap the coffee (or decorated coffee)
    }
    getCost() {
        return this.coffee.getCost() + 10;  // Original cost + sugar charge
    }
    getDescription() {
        return this.coffee.getDescription() + ", Sugar";
    }
}

// ============================================================================
// USAGE EXAMPLE
// ============================================================================
// The magic: we can stack decorators on top of each other!

let myCoffee = new Coffee();                    // Base: ₹50, "Simple Coffee"
myCoffee = new ColdCoffeeDecorator(myCoffee);   // Wrap with cold: ₹60, "Simple Coffee, Cold"
myCoffee = new SugarDecorator(myCoffee);        // Wrap with sugar: ₹70, "Simple Coffee, Cold, Sugar"

console.log(myCoffee.getDescription());  // "Simple Coffee, Cold, Sugar"
console.log(myCoffee.getCost());         // 70

/**
 * VISUALIZATION OF WRAPPING:
 *
 *    ┌─────────────────────────────────┐
 *    │  SugarDecorator                 │
 *    │  ┌───────────────────────────┐  │
 *    │  │  ColdCoffeeDecorator      │  │
 *    │  │  ┌─────────────────────┐  │  │
 *    │  │  │      Coffee         │  │  │
 *    │  │  │   cost: 50          │  │  │
 *    │  │  └─────────────────────┘  │  │
 *    │  │      cost: 50 + 10 = 60   │  │
 *    │  └───────────────────────────┘  │
 *    │        cost: 60 + 10 = 70       │
 *    └─────────────────────────────────┘
 */