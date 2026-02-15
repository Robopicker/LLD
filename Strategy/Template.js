/**
 * ============================================================================
 * TEMPLATE METHOD PATTERN
 * ============================================================================
 *
 * DEFINITION:
 * The Template Method Pattern defines the skeleton of an algorithm in a method,
 * deferring some steps to subclasses. It lets subclasses redefine certain steps
 * of an algorithm without changing the algorithm's structure.
 *
 * WHEN TO USE:
 * - When you have an algorithm with fixed steps but varying implementations
 * - When you want to avoid code duplication across similar algorithms
 * - When you want to control the extension points of an algorithm
 * - When subclasses should only override specific parts, not the whole algorithm
 *
 * KEY COMPONENTS:
 * 1. Abstract Class     - defines template method and abstract steps (Template)
 * 2. Template Method    - the algorithm skeleton that calls abstract methods (execute)
 * 3. Abstract Methods   - steps to be implemented by subclasses (boot, load, start)
 * 4. Concrete Classes   - implement the abstract methods (NormalStart, ModifiedStart)
 *
 * THE FLOW:
 * 1. Client calls templateMethod (execute) on concrete class
 * 2. Template method calls abstract methods in defined order
 * 3. Each abstract method runs the subclass implementation
 * 4. Algorithm completes with customized steps
 *
 * REAL-WORLD EXAMPLES:
 * - Application lifecycle (onCreate, onStart, onResume in Android)
 * - Build processes (compile, test, package, deploy)
 * - Document generation (header, body, footer)
 * - Game loops (init, update, render)
 * - HTTP request handling (authenticate, validate, process, respond)
 *
 * ============================================================================
 * UML DIAGRAM (Template Method Pattern)
 * ============================================================================
 *
 *     ┌──────────────────────────────────────────────────────────────────┐
 *     │                         Template                                 │
 *     │                    <<Abstract Class>>                            │
 *     ├──────────────────────────────────────────────────────────────────┤
 *     │  + execute(): void        ← Template Method (final algorithm)    │
 *     │  + boot(): void           ← Abstract (must override)             │
 *     │  + load(): void           ← Abstract (must override)             │
 *     │  + start(): void          ← Abstract (must override)             │
 *     └──────────────────────────┬───────────────────────────────────────┘
 *                                │
 *                                │ extends
 *              ┌─────────────────┴─────────────────┐
 *              │                                   │
 *              ▼                                   ▼
 *     ┌─────────────────────────┐       ┌─────────────────────────┐
 *     │      NormalStart        │       │     ModifiedStart       │
 *     │  <<Concrete Class>>     │       │  <<Concrete Class>>     │
 *     ├─────────────────────────┤       ├─────────────────────────┤
 *     │  + boot(): void         │       │  + boot(): void         │
 *     │  + load(): void         │       │  + load(): void         │
 *     │  + start(): void        │       │  + start(): void        │
 *     └─────────────────────────┘       └─────────────────────────┘
 *
 *     ┌──────────────────────────────────────────────────────────────────┐
 *     │  TEMPLATE METHOD (execute):                                      │
 *     │  ┌─────────────────────────────────────────────────────────┐     │
 *     │  │  execute() {                                            │     │
 *     │  │      this.boot();   // Step 1 - subclass implements     │     │
 *     │  │      this.load();   // Step 2 - subclass implements     │     │
 *     │  │      this.start();  // Step 3 - subclass implements     │     │
 *     │  │  }                                                      │     │
 *     │  └─────────────────────────────────────────────────────────┘     │
 *     └──────────────────────────────────────────────────────────────────┘
 *
 *     ┌──────────────────────────────────────────────────────────────────┐
 *     │  FLOW:                                                           │
 *     │  1. Client creates concrete class (new NormalStart())            │
 *     │  2. Client calls execute() - the template method                 │
 *     │  3. execute() calls boot() → subclass implementation runs        │
 *     │  4. execute() calls load() → subclass implementation runs        │
 *     │  5. execute() calls start() → subclass implementation runs       │
 *     └──────────────────────────────────────────────────────────────────┘
 *
 *     ┌──────────────────────────────────────────────────────────────────┐
 *     │  RELATIONSHIPS:                                                  │
 *     ├──────────────────────────────────────────────────────────────────┤
 *     │  NormalStart ──────▷ Template   : Inheritance (extends)          │
 *     │  ModifiedStart ────▷ Template   : Inheritance (extends)          │
 *     │  Client ───────────> Template   : Dependency (uses)              │
 *     ├──────────────────────────────────────────────────────────────────┤
 *     │  UML NOTATION:                                                   │
 *     │  ──────▷  Inheritance - subclass extends abstract class          │
 *     │  ─────>   Dependency - client uses the template                  │
 *     └──────────────────────────────────────────────────────────────────┘
 *
 * ============================================================================
 */

// ============================================================================
// ABSTRACT CLASS (Template)
// ============================================================================
// Defines the algorithm skeleton and abstract methods to be overridden

class Template {
    boot() {
        throw new Error("boot() method must be implemented");
    }
    load() {
        throw new Error("load() method must be implemented")
    }
    start() {
        throw new Error("start() method must be implemented");
    }
    // Template Method - defines the algorithm skeleton
    // Subclasses cannot override this (conceptually final)
    execute() {
        this.boot();
        this.load();
        this.start();
    }
}

// ============================================================================
// CONCRETE CLASSES
// ============================================================================
// Each subclass implements the abstract methods with specific behavior

class NormalStart extends Template {
    boot() {
        console.log("you are booting normal start")
    }
    load() {
        console.log("you are loading normal")
    }
    start() {
        console.log("you are starting normal")
    }

}
class ModifiedStart extends Template {
    boot() {
        console.log("you are booting modified start")
    }
    load() {
        console.log("you are loading modified")
    }
    start() {
        console.log("you are starting modified")
    }

}

// ============================================================================
// USAGE EXAMPLE
// ============================================================================
// Client uses concrete class but calls the template method

function main() {
    console.log("--- Normal Start ---");
    const normal = new NormalStart();
    normal.execute();  // Calls: boot() → load() → start()

    console.log("\n--- Modified Start ---");
    const modified = new ModifiedStart();
    modified.execute();  // Same algorithm, different implementation
}
main();