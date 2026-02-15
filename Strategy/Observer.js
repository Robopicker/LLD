/**
 * ============================================================================
 * OBSERVER PATTERN
 * ============================================================================
 *
 * DEFINITION:
 * The Observer Pattern defines a one-to-many dependency between objects.
 * When one object (Subject) changes state, all its dependents (Observers)
 * are notified and updated automatically.
 *
 * WHEN TO USE:
 * - When changes to one object require changing others, and you don't know how many
 * - When an object should notify other objects without knowing who they are
 * - When you need to implement event handling systems
 * - When you want loose coupling between components
 *
 * KEY COMPONENTS:
 * 1. Subject (Publisher)   - maintains list of observers, notifies them of changes
 * 2. Observer (Subscriber) - interface for objects that should be notified
 * 3. Concrete Observers    - implement update logic (Logger, UI here)
 *
 * THE FLOW:
 * 1. Observers subscribe to Subject (add)
 * 2. Subject state changes (setState)
 * 3. Subject notifies all observers (notify)
 * 4. Each observer updates itself (update)
 *
 * REAL-WORLD EXAMPLES:
 * - Event listeners in DOM (addEventListener)
 * - Redux/MobX state management
 * - WebSocket message broadcasting
 * - Newsletter subscriptions
 * - Stock price updates
 * - Social media notifications
 *
 * ============================================================================
 * UML DIAGRAM (Observer Pattern)
 * ============================================================================
 *
 *     ┌──────────────────────────────────────────────────────────────────┐
 *     │                         Subject                                  │
 *     │                      <<Publisher>>                               │
 *     ├──────────────────────────────────────────────────────────────────┤
 *     │  - observers: Set<Observer>                                      │
 *     │  - state: Object                                                 │
 *     ├──────────────────────────────────────────────────────────────────┤
 *     │  + add(observer): void                                           │
 *     │  + remove(observer): void                                        │
 *     │  + notify(data): void                                            │
 *     │  + setState(newState): void                                      │
 *     └──────────────────────────┬───────────────────────────────────────┘
 *                                │
 *                                │ notifies (1 to many)
 *                                │
 *                                ◇ observers
 *                                │
 *                                ▼
 *     ┌──────────────────────────────────────────────────────────────────┐
 *     │                      <<interface>>                               │
 *     │                        Observer                                  │
 *     │                      <<Subscriber>>                              │
 *     ├──────────────────────────────────────────────────────────────────┤
 *     │  + update(data): void                                            │
 *     └──────────────────────────┬───────────────────────────────────────┘
 *                                │
 *              ┌─────────────────┴─────────────────┐
 *              │                                   │
 *              ▼                                   ▼
 *     ┌─────────────────────────┐       ┌─────────────────────────┐
 *     │        Logger           │       │           UI            │
 *     │  <<ConcreteObserver>>   │       │  <<ConcreteObserver>>   │
 *     ├─────────────────────────┤       ├─────────────────────────┤
 *     │  + update(data): void   │       │  + update(data): void   │
 *     │    → logs to console    │       │    → renders UI         │
 *     └─────────────────────────┘       └─────────────────────────┘
 *
 *     ┌──────────────────────────────────────────────────────────────────┐
 *     │  FLOW:                                                           │
 *     │  1. Observers register with Subject via add(observer)            │
 *     │  2. Client calls subject.setState(newState)                      │
 *     │  3. Subject internally calls notify(state)                       │
 *     │  4. notify() iterates over all observers, calling update(data)   │
 *     │  5. Each observer handles the update independently               │
 *     └──────────────────────────────────────────────────────────────────┘
 *
 *     ┌──────────────────────────────────────────────────────────────────┐
 *     │  RELATIONSHIPS:                                                  │
 *     ├──────────────────────────────────────────────────────────────────┤
 *     │  Subject ◇────────> Observer      : Aggregation (has many)       │
 *     │  Logger ──────────▷ Observer      : Implements (is-a)            │
 *     │  UI ──────────────▷ Observer      : Implements (is-a)            │
 *     │  Subject ─────────> Observer      : Dependency (notifies)        │
 *     ├──────────────────────────────────────────────────────────────────┤
 *     │  UML NOTATION:                                                   │
 *     │  ◇─────>  Aggregation - Subject holds references to Observers   │
 *     │  ──────▷  Inheritance/Implementation - "is-a" relationship       │
 *     │  ─────>   Dependency - Subject calls Observer.update()           │
 *     └──────────────────────────────────────────────────────────────────┘
 *
 * ============================================================================
 */

// ============================================================================
// SUBJECT (Publisher)
// ============================================================================
// The Subject holds state and notifies observers when state changes

class Subject {
    constructor() {
        this.observers = new Set()  // Set prevents duplicate observers
    }

    // Subscribe: Add an observer to be notified of changes
    add(observer) {
        this.observers.add(observer);
    }

    // Unsubscribe: Remove an observer (note: Set uses delete, not remove)
    remove(observer) {
        this.observers.delete(observer);  // Fixed: was .remove(), should be .delete()
    }

    // Notify all observers of the change
    // This is the "push" model - subject pushes data to observers
    notify(data) {
        for (let observer of this.observers) {
            observer.update(data);  // Each observer decides how to handle the data
        }
    }

    // Business method that triggers notification
    // Whenever state changes, all observers are automatically notified
    setState(newState) {
        this.state = newState;
        this.notify(this.state);  // This is the magic - automatic notification!
    }
}

// ============================================================================
// CONCRETE OBSERVERS (Subscribers)
// ============================================================================
// Each observer implements update() to react to state changes

// Logger observer - logs state changes to console
class Logger {
    update(data) {
        console.log("Logger: state changed →", data.count, data.timestamp);
    }
}

// UI observer - updates the user interface
class UI {
    update(data) {
        console.log("UI: rendering new state →", data.count, data.timestamp);
    }
}

// ============================================================================
// USAGE EXAMPLE
// ============================================================================
// Multiple observers react to a single state change

const count = new Subject()      // Create the subject (publisher)
const log = new Logger()         // Create observer 1
const ui = new UI();             // Create observer 2

// Subscribe observers to the subject
count.add(log)
count.add(ui)

// Change state - BOTH observers will be notified automatically!
count.setState({ count: 1, timestamp: Date.now() });
// Output:
// Logger: state changed → 1 1705123456789
// UI: rendering new state → 1 1705123456789
