/**
 * ============================================================================
 * STRATEGY PATTERN
 * ============================================================================
 *
 * DEFINITION:
 * The Strategy Pattern defines a family of algorithms, encapsulates each one,
 * and makes them interchangeable. It lets the algorithm vary independently
 * from clients that use it.
 *
 * WHEN TO USE:
 * - When you have multiple ways to do the same thing (different algorithms)
 * - When you want to switch algorithms at runtime
 * - When you have a lot of conditional logic (if/else or switch) for selecting behavior
 * - When you want to isolate the algorithm logic from the code that uses it
 *
 * KEY COMPONENTS:
 * 1. Strategy Interface   - common interface for all algorithms (DiscountStrategy)
 * 2. Concrete Strategies  - implement the algorithm (NoDiscount, FestivalDiscount, etc.)
 * 3. Context              - holds a reference to a strategy and delegates work to it (Order)
 *
 * STRATEGY vs FACTORY:
 * - Factory: "Create the RIGHT object for me" (object creation)
 * - Strategy: "I have an object, let me CHANGE its behavior" (behavior variation)
 *
 * REAL-WORLD EXAMPLES:
 * - Payment methods (Card, UPI, Wallet)
 * - Sorting algorithms (QuickSort, MergeSort, BubbleSort)
 * - Compression algorithms (ZIP, RAR, GZIP)
 * - Discount calculations (this example)
 * - Authentication strategies (JWT, OAuth, Session)
 *
 * ============================================================================
 */

// ┌─────────────────────────────────────────────────────────────────────────────┐
// │                         STRATEGY DESIGN PATTERN                             │
// └─────────────────────────────────────────────────────────────────────────────┘

//                             ┌─────────────────────────┐
//                             │         Order           │  ← CONTEXT
//                             │       (Context)         │
//                             ├─────────────────────────┤
//                             │ - customer              │
//                             │ - items                 │
//                             │ - total                 │
//                             │ - discountStrategy      │───────────────┐
//                             ├─────────────────────────┤               │
//                             │ + setDiscountStrategy() │               │
//                             │ + getFinalAmount()      │               │
//                             │ + applyBestDiscount()   │               │
//                             └─────────────────────────┘               │
//                                                                       │ uses
//                                                                       ▼
//                           ┌───────────────────────────────┐
//                           │    <<interface>>              │  ← STRATEGY
//                           │    DiscountStrategy           │
//                           ├───────────────────────────────┤
//                           │ + calculateDiscount(order)    │
//                           └───────────────────────────────┘
//                                         △
//                                         │ implements
//           ┌─────────────┬───────────────┼───────────────┬─────────────┐
//           │             │               │               │             │
//           ▼             ▼               ▼               ▼             ▼
// ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
// │  NoDiscount  │ │FestivalDisc. │ │LoyaltyDisc.  │ │FirstOrderDis.│ │ BulkDiscount │
// ├──────────────┤ ├──────────────┤ ├──────────────┤ ├──────────────┤ ├──────────────┤
// │              │ │              │ │              │ │              │ │              │
// ├──────────────┤ ├──────────────┤ ├──────────────┤ ├──────────────┤ ├──────────────┤
// │+calculate    │ │+calculate    │ │+calculate    │ │+calculate    │ │+calculate    │
// │ Discount()   │ │ Discount()   │ │ Discount()   │ │ Discount()   │ │ Discount()   │
// │ return 0     │ │ return 20%   │ │ return 12%   │ │ return 30%   │ │ return ₹199  │
// └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
//        ↑                              CONCRETE STRATEGIES


// ════════════════════════════════════════════════════════════════════════════════
//                               KEY RELATIONSHIPS
// ════════════════════════════════════════════════════════════════════════════════

// ┌─────────────────┬────────────────────┬─────────────────────┬──────────────────┐
// │  Relationship   │        From        │         To          │       Type       │
// ├─────────────────┼────────────────────┼─────────────────────┼──────────────────┤
// │  Association    │       Order        │  DiscountStrategy   │ Has-a (uses)     │
// │  Inheritance    │ Concrete Strategies│  DiscountStrategy   │ Implements       │
// └─────────────────┴────────────────────┴─────────────────────┴──────────────────┘


// ════════════════════════════════════════════════════════════════════════════════
//                                 HOW IT WORKS
// ════════════════════════════════════════════════════════════════════════════════

// 1. CONTEXT (Order) holds a reference to a DiscountStrategy
// 2. STRATEGY INTERFACE defines the contract: calculateDiscount(order)
// 3. CONCRETE STRATEGIES implement different discount algorithms
// 4. RUNTIME SWITCHING: Call setDiscountStrategy() to change behavior dynamically


// Enum for discount types (for type safety and autocomplete)
const DiscountType = {
    NONE: 'none',
    FESTIVAL: 'festival',
    LOYALTY: 'loyalty',
    FIRST_ORDER: 'first_order',
    BULK: 'bulk'
};

// ============================================================================
// STRATEGY INTERFACE (Abstract class)
// ============================================================================
// Defines the contract that all discount strategies must follow

class DiscountStrategy {
    calculateDiscount(order) {
      throw new Error("Method 'calculateDiscount()' must be implemented.");
    }
}

// ============================================================================
// CONCRETE STRATEGIES
// ============================================================================
// Each class implements a different discount algorithm

// No discount - returns 0
class NoDiscount extends DiscountStrategy {
    calculateDiscount() { return 0; }
}

// Festival discount - flat 20% off for everyone
class FestivalDiscount extends DiscountStrategy {
    calculateDiscount(order) {
      return order.total * 0.20;
    }
}

// Loyalty discount - 12% off for customers with >10 orders
class LoyaltyDiscount extends DiscountStrategy {
    calculateDiscount(order) {
      return order.customer.ordersCount > 10 ? order.total * 0.12 : 0;
    }
}

// First order discount - 30% off for new customers
class FirstOrderDiscount extends DiscountStrategy {
    calculateDiscount(order) {
      return order.customer.ordersCount === 0 ? order.total * 0.30 : 0;
    }
}

// Bulk discount - flat ₹199 off for 5+ items
class BulkDiscount extends DiscountStrategy {
    calculateDiscount(order) {
      return order.items.length >= 5 ? 199 : 0;
    }
}

// ============================================================================
// CONTEXT CLASS
// ============================================================================
// The Order class uses a strategy but doesn't know which one.
// It delegates the discount calculation to whatever strategy is set.

class Order {
    constructor(customer, items, total) {
      this.customer = customer;
      this.items = items;
      this.total = total;
      this.discountStrategy = new NoDiscount(); // default strategy
    }

    // Change strategy at runtime - this is the power of Strategy Pattern!
    setDiscountStrategy(strategy) {
      this.discountStrategy = strategy;
    }

    // Delegate to the strategy - Order doesn't know HOW discount is calculated
    getFinalAmount() {
      const discount = this.discountStrategy.calculateDiscount(this);
      return Math.max(0, this.total - discount);
    }

    // Business logic to auto-select the best discount
    // This could also be extracted to a separate class
    applyBestDiscount() {
      if (this.customer.ordersCount === 0) {
        this.setDiscountStrategy(new FirstOrderDiscount());
      } else if (this.items.length >= 5) {
        this.setDiscountStrategy(new BulkDiscount());
      } else if (this.customer.ordersCount > 10) {
        this.setDiscountStrategy(new LoyaltyDiscount());
      } else if (new Date().getMonth() === 9) { // October → Diwali
        this.setDiscountStrategy(new FestivalDiscount());
      }
    }
}

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

const customer = { ordersCount: 0 };
const order = new Order(customer, ["Laptop", "Mouse", "Bag"], 125000);

// First order → 30% off → 125000 - 37500 = 87500
order.applyBestDiscount();
console.log("Final amount:", order.getFinalAmount());

// Simulate returning customer with 12 orders → Loyalty 12% off
customer.ordersCount = 12;
order.applyBestDiscount();
console.log("Now with loyalty:", order.getFinalAmount()); // 125000 - 15000 = 110000