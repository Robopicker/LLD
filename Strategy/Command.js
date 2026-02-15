/**
 * ============================================================================
 * COMMAND PATTERN
 * ============================================================================
 *
 * DEFINITION:
 * The Command Pattern encapsulates a request as an object, allowing you to
 * parameterize clients with different requests, queue or log requests,
 * and support undoable operations.
 *
 * WHEN TO USE:
 * - When you want to queue operations (like this example)
 * - When you need undo/redo functionality
 * - When you want to log or audit actions
 * - When you want to decouple the sender from the receiver
 *
 * KEY COMPONENTS:
 * 1. Command Interface  - defines execute() method (and optionally undo())
 * 2. Concrete Commands  - implements execute() with specific action
 * 3. Invoker           - stores and executes commands (CommandQueue here)
 * 4. Receiver          - the actual object that performs the work
 *
 * REAL-WORLD EXAMPLES:
 * - Text editor undo/redo
 * - Transaction systems
 * - Task schedulers
 * - Smart home automation (like this example)
 * - Redux actions in React
 *
 * ============================================================================
 */

// INVOKER: Stores commands and executes them later
// This decouples "when" to execute from "what" to execute
class CommandQueue {
    constructor() {
      this.queue = [];  // Stores commands to be executed
    }

    // Add a command to the queue (doesn't execute yet)
    add(command) {
      this.queue.push(command);
    }

    // Execute all queued commands in order (FIFO)
    executeAll() {
      console.log("Executing queued commands...");
      while (this.queue.length > 0) {
        const cmd = this.queue.shift();  // Remove and get first command
        try {
          cmd.execute();  // Each command knows how to execute itself
        } catch (e) {
          console.error("Command failed:", e);
          // You could implement rollback here by calling cmd.undo()
        }
      }
    }
  }

// CONCRETE COMMANDS: Each command encapsulates a single action
// All commands must have an execute() method

// Simple command object (no parameters needed)
const turnOnLight = {
    execute: () => console.log("💡 Light ON")
};

// Command factory function (when you need parameters)
// Returns a new command object with the parameter "baked in"
const setTemperature = (temp) => ({
    execute: () => console.log(`🌡️ Set temperature to ${temp}°C`)
});

const playMusic = {
    execute: () => console.log("🎵 Playing favorite playlist")
};

// ============================================================================
// USAGE EXAMPLE: Smart Home "Morning Routine" Macro
// ============================================================================
// The beauty of Command Pattern: you can compose multiple commands
// and execute them as a single operation

const morningRoutine = new CommandQueue();

// Queue up commands (nothing executes yet)
morningRoutine.add(turnOnLight);
morningRoutine.add(setTemperature(22));
morningRoutine.add(playMusic);

// Execute all at once
morningRoutine.executeAll();


// ============================================================================
// PART 2: UNDO/REDO - HOW IT WORKS
// ============================================================================
/**
 * UNDO MECHANISM:
 *
 * 1. Each command must store PREVIOUS STATE before executing
 * 2. execute() → saves old state, then applies new state
 * 3. undo() → restores the saved old state
 *
 * KEY INSIGHT: The command is responsible for knowing how to reverse itself!
 *
 *    ┌─────────────────────────────────────────────────────────────┐
 *    │                    COMMAND OBJECT                           │
 *    ├─────────────────────────────────────────────────────────────┤
 *    │  - receiver: the object being modified                      │
 *    │  - previousState: saved before execute()                    │
 *    │  - newState: the change to apply                            │
 *    ├─────────────────────────────────────────────────────────────┤
 *    │  execute():                                                 │
 *    │    1. this.previousState = receiver.getState()              │
 *    │    2. receiver.setState(this.newState)                      │
 *    │                                                             │
 *    │  undo():                                                    │
 *    │    1. receiver.setState(this.previousState)                 │
 *    └─────────────────────────────────────────────────────────────┘
 *
 * HISTORY STACK VISUALIZATION:
 *
 *    execute(cmd1) → history: [cmd1]              redoStack: []
 *    execute(cmd2) → history: [cmd1, cmd2]        redoStack: []
 *    execute(cmd3) → history: [cmd1, cmd2, cmd3]  redoStack: []
 *    undo()        → history: [cmd1, cmd2]        redoStack: [cmd3]
 *    undo()        → history: [cmd1]              redoStack: [cmd3, cmd2]
 *    redo()        → history: [cmd1, cmd2]        redoStack: [cmd3]
 */

// ============================================================================
// PART 3: TEXT EDITOR EXAMPLE (Classic Undo/Redo)
// ============================================================================

// RECEIVER: The object that holds the actual state
class TextEditor {
    constructor() {
        this.content = '';
    }

    getContent() {
        return this.content;
    }

    setContent(content) {
        this.content = content;
    }

    insertAt(position, text) {
        this.content = this.content.slice(0, position) + text + this.content.slice(position);
    }

    deleteRange(start, end) {
        this.content = this.content.slice(0, start) + this.content.slice(end);
    }
}

// COMMAND INTERFACE (base class)
class Command {
    execute() { throw new Error('execute() must be implemented'); }
    undo() { throw new Error('undo() must be implemented'); }
}

// CONCRETE COMMAND: Insert Text
class InsertTextCommand extends Command {
    constructor(editor, position, text) {
        super();
        this.editor = editor;      // Receiver
        this.position = position;  // Where to insert
        this.text = text;          // What to insert
        // No need to store previous state - we know exactly what we added
    }

    execute() {
        this.editor.insertAt(this.position, this.text);
        console.log(`✏️ Inserted "${this.text}" at position ${this.position}`);
    }

    undo() {
        // Remove the exact text we inserted
        this.editor.deleteRange(this.position, this.position + this.text.length);
        console.log(`↩️ Undo: Removed "${this.text}"`);
    }
}

// CONCRETE COMMAND: Delete Text
class DeleteTextCommand extends Command {
    constructor(editor, start, end) {
        super();
        this.editor = editor;
        this.start = start;
        this.end = end;
        this.deletedText = null;  // Will store what we deleted (for undo)
    }

    execute() {
        // IMPORTANT: Save what we're about to delete BEFORE deleting
        this.deletedText = this.editor.getContent().slice(this.start, this.end);
        this.editor.deleteRange(this.start, this.end);
        console.log(`🗑️ Deleted "${this.deletedText}"`);
    }

    undo() {
        // Restore the deleted text at the same position
        this.editor.insertAt(this.start, this.deletedText);
        console.log(`↩️ Undo: Restored "${this.deletedText}"`);
    }
}

// CONCRETE COMMAND: Replace Text
class ReplaceTextCommand extends Command {
    constructor(editor, start, end, newText) {
        super();
        this.editor = editor;
        this.start = start;
        this.end = end;
        this.newText = newText;
        this.oldText = null;  // Will store original text (for undo)
    }

    execute() {
        // Save original text BEFORE replacing
        this.oldText = this.editor.getContent().slice(this.start, this.end);
        this.editor.deleteRange(this.start, this.end);
        this.editor.insertAt(this.start, this.newText);
        console.log(`🔄 Replaced "${this.oldText}" with "${this.newText}"`);
    }

    undo() {
        // Reverse: remove new text, restore old text
        this.editor.deleteRange(this.start, this.start + this.newText.length);
        this.editor.insertAt(this.start, this.oldText);
        console.log(`↩️ Undo: Restored "${this.oldText}"`);
    }
}

// INVOKER: Command Manager with Undo/Redo stacks
class CommandManager {
    constructor() {
        this.history = [];     // Stack of executed commands
        this.redoStack = [];   // Stack of undone commands
    }

    execute(command) {
        command.execute();
        this.history.push(command);
        // Clear redo stack when new command is executed
        this.redoStack = [];
    }

    undo() {
        if (this.history.length === 0) {
            console.log('⚠️ Nothing to undo');
            return;
        }
        const command = this.history.pop();
        command.undo();
        this.redoStack.push(command);
    }

    redo() {
        if (this.redoStack.length === 0) {
            console.log('⚠️ Nothing to redo');
            return;
        }
        const command = this.redoStack.pop();
        command.execute();
        this.history.push(command);
    }
}

// ============================================================================
// DEMO: Text Editor with Undo/Redo
// ============================================================================

console.log('\n' + '='.repeat(50));
console.log('TEXT EDITOR UNDO/REDO DEMO');
console.log('='.repeat(50) + '\n');

const editor = new TextEditor();
const cmdManager = new CommandManager();

// Type "Hello"
cmdManager.execute(new InsertTextCommand(editor, 0, 'Hello'));
console.log(`Content: "${editor.getContent()}"\n`);

// Type " World"
cmdManager.execute(new InsertTextCommand(editor, 5, ' World'));
console.log(`Content: "${editor.getContent()}"\n`);

// Type "!"
cmdManager.execute(new InsertTextCommand(editor, 11, '!'));
console.log(`Content: "${editor.getContent()}"\n`);

// Undo the "!"
console.log('--- UNDO ---');
cmdManager.undo();
console.log(`Content: "${editor.getContent()}"\n`);

// Undo " World"
console.log('--- UNDO ---');
cmdManager.undo();
console.log(`Content: "${editor.getContent()}"\n`);

// Redo " World"
console.log('--- REDO ---');
cmdManager.redo();
console.log(`Content: "${editor.getContent()}"\n`);

// Replace "World" with "JavaScript"
cmdManager.execute(new ReplaceTextCommand(editor, 6, 11, 'JavaScript'));
console.log(`Content: "${editor.getContent()}"\n`);

// Undo the replace
console.log('--- UNDO ---');
cmdManager.undo();
console.log(`Content: "${editor.getContent()}"\n`);