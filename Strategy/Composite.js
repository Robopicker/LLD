// Composite Design Pattern Implementation
//
// The Composite pattern allows you to compose objects into tree structures
// and treat individual objects and compositions uniformly.
//
// Key Components:
// 1. Component - Abstract base class/interface for all objects in the composition
// 2. Leaf - Represents end objects with no children (e.g., File)
// 3. Composite - Contains children and implements child-related operations (e.g., Folder)
//
// Use Case: File System where folders can contain files or other folders

/*============================
    Component Interface
=============================*/

// Base component class that defines the common interface for both
// leaf (File) and composite (Folder) objects
class FileSystemComponent {
    constructor(name) {
        this.name = name;
    }

    // Returns the name of the component
    getName() {
        return this.name;
    }

    // Abstract method - must be implemented by subclasses
    // Returns the size of the component
    getSize() {
        throw new Error("Method 'getSize()' must be implemented.");
    }

    // Abstract method - must be implemented by subclasses
    // Displays the component with proper indentation
    display(indent = "") {
        throw new Error("Method 'display()' must be implemented.");
    }

    // Default implementations for composite operations
    // These throw errors for leaf nodes but are overridden in Composite

    // Add a child component (only valid for composites)
    add(component) {
        throw new Error("Cannot add to a leaf component.");
    }

    // Remove a child component (only valid for composites)
    remove(component) {
        throw new Error("Cannot remove from a leaf component.");
    }

    // Get a child by index (only valid for composites)
    getChild(index) {
        throw new Error("Cannot get child from a leaf component.");
    }
}

/*============================
    Leaf: File
=============================*/

// Leaf class - represents individual files (end nodes with no children)
// Implements the Component interface but cannot have children
class File extends FileSystemComponent {
    constructor(name, size) {
        super(name);
        this.size = size; // Size in KB
    }

    // Returns the file's size directly
    getSize() {
        return this.size;
    }

    // Displays the file with an icon and size
    display(indent = "") {
        console.log(`${indent}📄 ${this.name} (${this.size} KB)`);
    }
}

/*============================
    Composite: Folder
=============================*/

// Composite class - represents folders that can contain files or other folders
// Can have children (both File and Folder objects)
class Folder extends FileSystemComponent {
    constructor(name) {
        super(name);
        this.children = []; // Array to store child components (files/folders)
    }

    // Add a child component (file or folder) to this folder
    add(component) {
        this.children.push(component);
    }

    // Remove a child component from this folder
    remove(component) {
        const index = this.children.indexOf(component);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }

    // Get a child component by its index
    getChild(index) {
        return this.children[index];
    }

    // Recursively calculates total size by summing all children's sizes
    // This is the key feature of Composite pattern - uniform treatment
    getSize() {
        return this.children.reduce((total, child) => total + child.getSize(), 0);
    }

    // Displays the folder and recursively displays all children with indentation
    display(indent = "") {
        console.log(`${indent}📁 ${this.name} (${this.getSize()} KB)`);
        for (const child of this.children) {
            child.display(indent + "  "); // Increase indent for children
        }
    }
}

/*============================
           Main
=============================*/

function main() {
    // Step 1: Create leaf nodes (files)
    const file1 = new File("document.txt", 10);
    const file2 = new File("image.png", 150);
    const file3 = new File("video.mp4", 500);
    const file4 = new File("notes.txt", 5);
    const file5 = new File("config.json", 2);

    // Step 2: Create composite nodes (folders)
    const rootFolder = new Folder("Root");
    const documentsFolder = new Folder("Documents");
    const mediaFolder = new Folder("Media");
    const configFolder = new Folder("Config");

    // Step 3: Build the tree structure
    // Add subfolders to root
    rootFolder.add(documentsFolder);
    rootFolder.add(mediaFolder);
    rootFolder.add(configFolder);

    // Add files to Documents folder
    documentsFolder.add(file1);
    documentsFolder.add(file4);

    // Add files to Media folder
    mediaFolder.add(file2);
    mediaFolder.add(file3);

    // Add files to Config folder
    configFolder.add(file5);

    // Step 4: Demonstrate uniform treatment of components
    // Both files and folders respond to getSize() and display()
    console.log("=== File System Structure ===\n");
    rootFolder.display(); // Recursively displays entire tree

    // Step 5: Show that size calculation works uniformly
    console.log("\n=== Individual Component Sizes ===\n");
    console.log(`Documents folder size: ${documentsFolder.getSize()} KB`);
    console.log(`Media folder size: ${mediaFolder.getSize()} KB`);
    console.log(`Total root folder size: ${rootFolder.getSize()} KB`);
}

// Run main
main();
