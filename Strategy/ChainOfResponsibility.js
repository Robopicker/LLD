// Chain of Responsibility Pattern
// Definition: A behavioral design pattern that lets you pass requests along a chain of handlers.
// Each handler decides either to process the request or pass it to the next handler in the chain.
//
// Use Case: ATM Cash Dispenser - dispenses money using different denomination handlers
// The request (withdrawal amount) passes through handlers (1000, 500 notes) until fully processed.

// Base Handler class - defines the interface for all concrete handlers
class Handler {
    constructor() {
        this.nextHandler = null
    }
    setNextHandler(handler) {
        this.nextHandler = handler
    }
    dispense(price) {
        throw new Error("dispense() method must be implemented");
    }
}

// Concrete Handler for 1000 rupee notes
class ThousandHandler extends Handler {
    constructor(numOfNotes) {
        super();
        this.numOfNotes = numOfNotes;
    }
    dispense(amount) {
        let noteNeeded = amount/1000
        if(noteNeeded>this.numOfNotes) {
            noteNeeded = this.numOfNotes;
            this.numOfNotes = 0;
        } else{
            this.numOfNotes -=noteNeeded;
        }
        if(noteNeeded > 0) {
            console.log("dispensing ", noteNeeded, "from thousand dispenser");
            let remainingAmount = amount - 1000* noteNeeded
            if(remainingAmount >0) {
                if(this.nextHandler != null) {
                    this.nextHandler.dispense(remainingAmount)
                } else {
                    console.log("cannot dispense more amount");
                }
            }
        }
    }
}

// Concrete Handler for 500 rupee notes
class FiveHandler extends Handler {
    constructor(numOfNotes) {
        super()
        this.numOfNotes = numOfNotes;
    }
    dispense(amount) {
        let noteNeeded = amount/500
        if(noteNeeded>this.numOfNotes) {
            noteNeeded = this.numOfNotes;
            this.numOfNotes = 0;
        } else{
            this.numOfNotes -=noteNeeded;
        }
        if(noteNeeded > 0) {
            console.log("dispensing ", noteNeeded, "from five hundred dispenser");
            let remainingAmount = amount - 500* noteNeeded
            if(remainingAmount >0) {
                if(this.nextHandler != null) {
                    this.nextHandler.dispense(remainingAmount)
                } else {
                    console.log("cannot dispense more amount");
                }
            }
        }
    }
}

// Client code - sets up the chain: ThousandHandler -> FiveHandler
// Dispense request flows through the chain until amount is fully dispensed
function main() {
    var tHandler = new ThousandHandler(3)
    var fHandler = new FiveHandler(10);
    tHandler.setNextHandler(fHandler);
    tHandler.dispense(4000)
}
main()