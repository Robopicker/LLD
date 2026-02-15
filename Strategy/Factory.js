/**
 * ============================================================================
 * FACTORY PATTERN
 * ============================================================================
 *
 * DEFINITION:
 * The Factory Pattern provides an interface for creating objects without
 * specifying their exact classes. It centralizes object creation logic
 * and returns the appropriate instance based on input parameters.
 *
 * WHEN TO USE:
 * - When you don't know ahead of time which class you need to instantiate
 * - When object creation logic is complex or involves conditions
 * - When you want to hide the creation logic from the client
 * - When you need to create different types of related objects
 *
 * KEY COMPONENTS:
 * 1. Product Interface  - common interface for all products (PaymentProcessor)
 * 2. Concrete Products  - specific implementations (CardProcessor, UpiProcessor)
 * 3. Factory            - creates and returns the appropriate product (PaymentFactory)
 *
 * FACTORY vs STRATEGY:
 * - Factory: "Create the RIGHT object for me" (object creation)
 * - Strategy: "I have an object, let me CHANGE its behavior" (behavior variation)
 *
 * TYPES OF FACTORY PATTERNS:
 * 1. Simple Factory    - single method to create objects (this example)
 * 2. Factory Method    - subclasses decide which class to instantiate
 * 3. Abstract Factory  - creates families of related objects
 *
 * REAL-WORLD EXAMPLES:
 * - Payment processors (this example)
 * - Database connections (MySQL, PostgreSQL, MongoDB)
 * - UI component libraries (Button, Input, Modal)
 * - Document parsers (PDF, Word, Excel)
 * - Notification services (Email, SMS, Push)
 *
 * ============================================================================
 * UML DIAGRAM (Simple Factory)
 * ============================================================================
 *
 *     ┌──────────────────────────────────────────────────────────────────┐
 *     │                         CLIENT                                   │
 *     │                      checkout()                                  │
 *     └──────────────────────────┬───────────────────────────────────────┘
 *                                │
 *                                │ uses
 *                                ▼
 *     ┌──────────────────────────────────────────────────────────────────┐
 *     │                    PaymentFactory                                │
 *     │                      <<Factory>>                                 │
 *     ├──────────────────────────────────────────────────────────────────┤
 *     │  + createProcessor(type, config): PaymentProcessor               │
 *     └──────────────────────────┬───────────────────────────────────────┘
 *                                │
 *                                │ creates
 *                                ▼
 *     ┌──────────────────────────────────────────────────────────────────┐
 *     │                   PaymentProcessor                               │
 *     │                  <<Abstract Product>>                            │
 *     ├──────────────────────────────────────────────────────────────────┤
 *     │  # config: Object                                                │
 *     ├──────────────────────────────────────────────────────────────────┤
 *     │  + process(amount): Result                                       │
 *     └──────────────────────────┬───────────────────────────────────────┘
 *                                │
 *              ┌─────────────────┼─────────────────┐
 *              │                 │                 │
 *              ▼                 ▼                 ▼
 *     ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
 *     │ CardProcessor  │ │  UpiProcessor  │ │ WalletProcessor│
 *     │<<ConcreteProduct>>│<<ConcreteProduct>>│<<ConcreteProduct>>
 *     ├────────────────┤ ├────────────────┤ ├────────────────┤
 *     │ +process()     │ │ +process()     │ │ +process()     │
 *     └────────────────┘ └────────────────┘ └────────────────┘
 *
 *     ┌──────────────────────────────────────────────────────────────────┐
 *     │  FLOW:                                                           │
 *     │  1. Client calls PaymentFactory.createProcessor(type, config)    │
 *     │  2. Factory uses switch/case to decide which class to create     │
 *     │  3. Factory returns the concrete product (CardProcessor, etc.)   │
 *     │  4. Client calls process() on the returned processor             │
 *     └──────────────────────────────────────────────────────────────────┘
 *
 *     ┌──────────────────────────────────────────────────────────────────┐
 *     │  RELATIONSHIPS:                                                  │
 *     ├──────────────────────────────────────────────────────────────────┤
 *     │  Client -----> PaymentFactory      : Dependency (uses)           │
 *     │  PaymentFactory -----> PaymentProcessor : Dependency (creates)   │
 *     │  CardProcessor ──────▷ PaymentProcessor : Inheritance (extends)  │
 *     │  UpiProcessor ──────▷ PaymentProcessor  : Inheritance (extends)  │
 *     │  WalletProcessor ──▷ PaymentProcessor   : Inheritance (extends)  │
 *     ├──────────────────────────────────────────────────────────────────┤
 *     │  UML NOTATION:                                                   │
 *     │  ─────>  Dependency (dashed arrow) - temporary relationship      │
 *     │  ─────▷  Inheritance (solid arrow) - "is-a" relationship         │
 *     │  ◆─────  Composition - "has-a" (strong ownership)                │
 *     │  ◇─────  Aggregation - "has-a" (weak ownership)                  │
 *     └──────────────────────────────────────────────────────────────────┘
 *
 * ============================================================================
 */

// Enum for payment types (for type safety and autocomplete)
export const PaymentType = {
    CARD: 'card',
    UPI: 'upi',
    WALLET: 'wallet',
    NETBANKING: 'netbanking'
}

// ============================================================================
// PRODUCT INTERFACE (Abstract class)
// ============================================================================
// Defines the contract that all payment processors must follow

class PaymentProcessor {
    constructor(config) {
        this.config = config
    }
    // All processors must implement this method
    process(amount) {
        throw new Error("method process() must be implemented")
    }
}

// ============================================================================
// CONCRETE PRODUCTS
// ============================================================================
// Each class implements the PaymentProcessor interface with specific logic

class CardProcessor extends PaymentProcessor {
    process(amount) {
        console.log(`charging ${amount} via Card .... ${JSON.stringify(this.config)}`)
        return { success: true, gateway: 'Razorpay/Card' };
    }
}

class UpiProcessor extends PaymentProcessor {
    process(amount) {
        console.log(`charging ${amount} via Upi .... ${JSON.stringify(this.config)}`)
        return { success: true, gateway: 'Upi' };
    }
}

class WalletProcess extends PaymentProcessor {
    process(amount) {
        console.log(`charging ${amount} via Wallet .... ${JSON.stringify(this.config)}`)
        return { success: true, gateway: 'Wallet' };
    }
}

// ============================================================================
// FACTORY CLASS
// ============================================================================
// Centralizes object creation - client doesn't need to know about concrete classes

class PaymentFactory {
    /**
     * Creates the appropriate payment processor based on type
     * @param {string} type - Payment type (card, upi, wallet, netbanking)
     * @param {object} config - Configuration for the processor
     * @returns {PaymentProcessor} - The appropriate processor instance
     */
    static createProcessor(type, config) {
        switch (type) {
            case PaymentType.CARD:
                // Extracts only last 4 digits for security
                return new CardProcessor({ last4: config.cardNumber?.slice(-4) });
            case PaymentType.UPI:
                return new UpiProcessor({ vpa: config.upiId });
            case PaymentType.WALLET:
                return new WalletProcess({ walletName: config.walletName });
            case PaymentType.NETBANKING:
                throw new Error('NetbankingProcessor not implemented');
            default:
                throw new Error(`Unknown payment type: ${type}`);
        }
    }
}

// ============================================================================
// USAGE EXAMPLE
// ============================================================================
// The client code doesn't know about CardProcessor, UpiProcessor, etc.
// It just asks the factory for "a payment processor" and uses it.

export function checkout(amount, paymentMethod, paymentDetails) {
    // Factory creates the right processor - client doesn't care which one
    const processor = PaymentFactory.createProcessor(
      paymentMethod,
      paymentDetails
    );
    // Polymorphism: same method call, different behavior
    return processor.process(amount);
}

// Examples
console.log(checkout(1499, PaymentType.CARD, { cardNumber: '4111111111111111' }));
console.log(checkout(799, PaymentType.UPI, { vpa: 'yogesh@oksbi' }));