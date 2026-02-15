/**
 * FACADE DESIGN PATTERN
 *
 * Purpose: Provides a simplified, unified interface to a complex subsystem.
 * Hides the complexity of multiple classes/components behind a single easy-to-use interface.
 *
 * Key Components:
 * 1. Subsystem Classes (BIOS, BootLoader, Kernel, DisplayManager) - Complex components
 * 2. Facade (Computer) - Provides simple interface to interact with subsystems
 * 3. Client - Uses only the Facade, unaware of subsystem complexity
 *
 * When to use:
 * - When you want to provide a simple interface to a complex subsystem
 * - When there are many dependencies between clients and implementation classes
 * - When you want to layer your subsystems (each layer has its own facade)
 *
 * Benefits:
 * - Reduces coupling between client and subsystem
 * - Promotes weak coupling - subsystems can change without affecting clients
 * - Doesn't prevent direct access to subsystems if needed
 */

// ── Subsystem Class 1 ──────────────────────────────────
// Handles hardware initialization and self-test
class BIOS {
    powerOnSelfTest() {
      console.log("BIOS: POST - checking hardware...");
      return true;
    }
  }

// ── Subsystem Class 2 ──────────────────────────────────
// Responsible for loading the operating system kernel
class BootLoader {
    loadKernel() {
      console.log("Bootloader: loading kernel into memory...");
      return "kernel loaded";
    }
  }

// ── Subsystem Class 3 ──────────────────────────────────
// Core OS component - manages drivers, memory, and filesystems
class Kernel {
    initialize() {
      console.log("Kernel: initializing drivers, memory manager, scheduler...");
    }
    mountRootFs() {
      console.log("Kernel: mounting root filesystem...");
    }
  }

// ── Subsystem Class 4 ──────────────────────────────────
// Handles graphical user interface initialization
class DisplayManager {
    startGUI() {
      console.log("Display Manager: starting graphical interface (GDM / SDDM / LightDM)...");
    }
  }

// ── FACADE ─────────────────────────────────────────────
// Provides a simple boot() method that orchestrates all subsystems
// Client doesn't need to know about BIOS, BootLoader, Kernel, or DisplayManager
class Computer {
    constructor() {
      // Facade holds references to all subsystem objects
      this.bios = new BIOS();
      this.bootLoader = new BootLoader();
      this.kernel = new Kernel();
      this.gui = new DisplayManager();
    }

    // Single simplified method that coordinates complex subsystem interactions
    // Client just calls boot() - all complexity is hidden inside
    boot() {
      console.log("┌───────────────────────┐");
      console.log("│     COMPUTER BOOT     │");
      console.log("└───────────────────────┘\n");

      // Step 1: Hardware check via BIOS
      if (!this.bios.powerOnSelfTest()) {
        throw new Error("Hardware check failed!");
      }

      // Step 2: Load kernel via BootLoader
      const kernelData = this.bootLoader.loadKernel();

      // Step 3: Initialize kernel and mount filesystem
      this.kernel.initialize();
      this.kernel.mountRootFs();

      // Step 4: Start graphical interface
      this.gui.startGUI();

      console.log("\nBoot completed successfully! Welcome to your desktop!");
    }
  }

// ── Usage ──────────────────────────────────────────────
// Client code is extremely simple - just create facade and call one method
// No need to understand or interact with BIOS, BootLoader, Kernel, DisplayManager
const pc = new Computer();
pc.boot();