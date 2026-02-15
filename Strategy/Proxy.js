/**
 * PROXY DESIGN PATTERN
 *
 * Intent: Provide a surrogate or placeholder for another object to control access to it.
 *
 * This example demonstrates a Virtual Proxy (lazy initialization) where the heavy
 * Image object is only created when actually needed (on first display() call).
 *
 * Types of Proxy:
 * - Virtual Proxy: Delays creation of expensive objects until needed (this example)
 * - Protection Proxy: Controls access based on permissions
 * - Remote Proxy: Represents an object in a different address space
 * - Caching Proxy: Stores results of expensive operations
 */

// Subject Interface - defines the common interface for RealSubject and Proxy
class IImage {
    display() {
        throw new Error("operation() must be implemented")
    }
}

// RealSubject - the actual object that does the real work
// This is typically expensive to create or resource-intensive
class Image extends IImage {
    constructor () {
        super()
        // Simulates loading a heavy resource (e.g., from disk or network)
        console.log("load heavy image in the project")
    }
    display() {
        console.log("display image")
    }
}

// Proxy - controls access to the RealSubject
// Implements the same interface so clients can use it interchangeably
class ImageProxy extends IImage {
    constructor(str) {
        super();
        this.fileName = str
        this.realImage = null  // Lazy initialization - real image not created yet
    }
    display() {
        // Create the real image only when needed (lazy loading)
        if(this.realImage === null) {
            this.realImage = new Image(this.fileName)
        }
        // Delegate the actual work to the real subject
        this.realImage.display()
    }
}

// Client code - uses the proxy instead of the real object
function main() {
    // Client works with proxy; real Image is not created here
    const proxy = new ImageProxy("yogesh image")
    // Real Image is created only when display() is called
    proxy.display();
}
main();