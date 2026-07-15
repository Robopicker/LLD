/**
 * ============================================================================
 * BRIDGE DESIGN PATTERN
 * ============================================================================
 *
 * DEFINITION:
 * The Bridge Pattern decouples an abstraction from its implementation so that
 * the two can vary independently. It uses composition over inheritance to
 * achieve this separation.
 *
 * WHEN TO USE:
 * - When you want to avoid permanent binding between abstraction and implementation
 * - When both abstraction and implementation should be extensible through subclassing
 * - When changes in implementation should not impact clients
 * - When you want to share an implementation among multiple objects
 * - When you have an explosion of classes due to multiple dimensions of variation
 *
 * KEY COMPONENTS:
 * 1. Abstraction       - High-level control layer (RemoteControl)
 * 2. Refined Abstraction - Extended abstraction (AdvancedRemote, BasicRemote)
 * 3. Implementation    - Interface for implementation classes (Device)
 * 4. Concrete Implementation - Actual implementations (TV, Radio)
 *
 * BRIDGE vs ADAPTER:
 * - Bridge: Designed upfront to let abstraction and implementation vary independently
 * - Adapter: Applied to make unrelated classes work together (retrofit pattern)
 *
 * BRIDGE vs STRATEGY:
 * - Bridge: Structural pattern - separates interface from implementation
 * - Strategy: Behavioral pattern - encapsulates algorithms and makes them interchangeable
 *
 * REAL-WORLD EXAMPLES:
 * - Remote controls (abstraction) working with different devices (implementation)
 * - Graphics rendering (shapes) with different rendering engines (OpenGL, DirectX)
 * - Database drivers (abstraction) with different databases (MySQL, PostgreSQL)
 * - UI components (abstraction) with platform-specific rendering (Windows, Mac, Linux)
 * - Notification systems (abstraction) with different channels (Email, SMS, Push)
 *
 * ============================================================================
 */

// ┌─────────────────────────────────────────────────────────────────────────────┐
// │                         BRIDGE DESIGN PATTERN                               │
// └─────────────────────────────────────────────────────────────────────────────┘

//                         ┌──────────────────────┐
//                         │   RemoteControl      │  ← ABSTRACTION
//                         │   (Abstraction)      │
//                         ├──────────────────────┤
//                         │ - device             │────────┐
//                         ├──────────────────────┤        │
//                         │ + togglePower()      │        │ uses
//                         │ + volumeUp()         │        │ (composition)
//                         │ + volumeDown()       │        │
//                         └──────────────────────┘        │
//                                   △                     │
//                                   │ extends             │
//                      ┌────────────┴────────────┐        │
//                      │                         │        │
//              ┌───────────────┐       ┌─────────────────┐│
//              │ BasicRemote   │       │ AdvancedRemote  ││
//              ├───────────────┤       ├─────────────────┤│
//              │               │       │                 ││
//              │+channelUp()   │       │+mute()          ││
//              │+channelDown() │       │+pictureInPic()  ││
//              └───────────────┘       └─────────────────┘│
//                                                          │
//                      REFINED ABSTRACTIONS               │
//                                                          │
//                                                          ▼
//                               ┌───────────────────────────────┐
//                               │    <<interface>>              │  ← IMPLEMENTATION
//                               │       Device                  │
//                               ├───────────────────────────────┤
//                               │ + isEnabled()                 │
//                               │ + enable() / disable()        │
//                               │ + getVolume() / setVolume()   │
//                               │ + getChannel() / setChannel() │
//                               └───────────────────────────────┘
//                                             △
//                                             │ implements
//                                  ┌──────────┴───────────┐
//                                  │                      │
//                                  ▼                      ▼
//                         ┌─────────────┐        ┌─────────────┐
//                         │     TV      │        │    Radio    │
//                         ├─────────────┤        ├─────────────┤
//                         │ - on        │        │ - on        │
//                         │ - volume    │        │ - volume    │
//                         │ - channel   │        │ - channel   │
//                         ├─────────────┤        ├─────────────┤
//                         │ + enable()  │        │ + enable()  │
//                         │ + disable() │        │ + disable() │
//                         │ + setVol()  │        │ + setVol()  │
//                         │ + setChan() │        │ + setChan() │
//                         └─────────────┘        └─────────────┘
//
//                          CONCRETE IMPLEMENTATIONS


// ════════════════════════════════════════════════════════════════════════════════
//                               KEY RELATIONSHIPS
// ════════════════════════════════════════════════════════════════════════════════

// ┌─────────────────┬────────────────────┬─────────────────────┬──────────────────┐
// │  Relationship   │        From        │         To          │       Type       │
// ├─────────────────┼────────────────────┼─────────────────────┼──────────────────┤
// │  Composition    │   RemoteControl    │      Device         │ Has-a (bridge)   │
// │  Inheritance    │  Refined Abstracts │  RemoteControl      │ Extends          │
// │  Inheritance    │  TV, Radio         │      Device         │ Implements       │
// └─────────────────┴────────────────────┴─────────────────────┴──────────────────┘


// ════════════════════════════════════════════════════════════════════════════════
//                                 HOW IT WORKS
// ════════════════════════════════════════════════════════════════════════════════

// 1. ABSTRACTION (RemoteControl) defines high-level operations
// 2. IMPLEMENTATION (Device) defines low-level operations
// 3. BRIDGE: Abstraction holds a reference to Implementation (composition)
// 4. Both hierarchies can evolve independently without affecting each other
// 5. You can combine any Remote with any Device at runtime


// ============================================================================
// IMPLEMENTATION INTERFACE
// ============================================================================
// Defines the interface for all device implementations

class Device {
    isEnabled() {
        throw new Error("isEnabled() must be implemented");
    }
    enable() {
        throw new Error("enable() must be implemented");
    }
    disable() {
        throw new Error("disable() must be implemented");
    }
    getVolume() {
        throw new Error("getVolume() must be implemented");
    }
    setVolume(volume) {
        throw new Error("setVolume() must be implemented");
    }
    getChannel() {
        throw new Error("getChannel() must be implemented");
    }
    setChannel(channel) {
        throw new Error("setChannel() must be implemented");
    }
}


// ============================================================================
// CONCRETE IMPLEMENTATIONS
// ============================================================================
// Different device types that implement the Device interface

class TV extends Device {
    constructor() {
        super();
        this.on = false;
        this.volume = 30;
        this.channel = 1;
    }

    isEnabled() {
        return this.on;
    }

    enable() {
        this.on = true;
        console.log("TV: Powered ON");
    }

    disable() {
        this.on = false;
        console.log("TV: Powered OFF");
    }

    getVolume() {
        return this.volume;
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(100, volume));
        console.log(`TV: Volume set to ${this.volume}`);
    }

    getChannel() {
        return this.channel;
    }

    setChannel(channel) {
        this.channel = channel;
        console.log(`TV: Channel changed to ${this.channel}`);
    }
}

class Radio extends Device {
    constructor() {
        super();
        this.on = false;
        this.volume = 20;
        this.channel = 101.5; // FM frequency
    }

    isEnabled() {
        return this.on;
    }

    enable() {
        this.on = true;
        console.log("Radio: Powered ON");
    }

    disable() {
        this.on = false;
        console.log("Radio: Powered OFF");
    }

    getVolume() {
        return this.volume;
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(100, volume));
        console.log(`Radio: Volume set to ${this.volume}`);
    }

    getChannel() {
        return this.channel;
    }

    setChannel(channel) {
        this.channel = channel;
        console.log(`Radio: Tuned to ${this.channel} FM`);
    }
}


// ============================================================================
// ABSTRACTION
// ============================================================================
// Defines the interface for control logic and holds a reference to Device

class RemoteControl {
    constructor(device) {
        // BRIDGE: RemoteControl is linked to Device via composition
        // This allows both to vary independently
        this.device = device;
    }

    togglePower() {
        if (this.device.isEnabled()) {
            this.device.disable();
        } else {
            this.device.enable();
        }
    }

    volumeUp() {
        const currentVolume = this.device.getVolume();
        this.device.setVolume(currentVolume + 10);
    }

    volumeDown() {
        const currentVolume = this.device.getVolume();
        this.device.setVolume(currentVolume - 10);
    }
}


// ============================================================================
// REFINED ABSTRACTIONS
// ============================================================================
// Extended versions of the abstraction with additional features

class BasicRemote extends RemoteControl {
    constructor(device) {
        super(device);
    }

    channelUp() {
        const currentChannel = this.device.getChannel();
        this.device.setChannel(currentChannel + 1);
    }

    channelDown() {
        const currentChannel = this.device.getChannel();
        this.device.setChannel(currentChannel - 1);
    }
}

class AdvancedRemote extends RemoteControl {
    constructor(device) {
        super(device);
    }

    mute() {
        console.log("Advanced Remote: Muting device");
        this.device.setVolume(0);
    }

    pictureInPicture() {
        if (this.device instanceof TV) {
            console.log("Advanced Remote: Enabling Picture-in-Picture mode");
        } else {
            console.log("Advanced Remote: PIP not supported on this device");
        }
    }
}


// ============================================================================
// USAGE EXAMPLES
// ============================================================================

console.log("═══════════════════════════════════════════════");
console.log("   BRIDGE PATTERN DEMO: Remote Controls");
console.log("═══════════════════════════════════════════════\n");

// Example 1: BasicRemote controlling a TV
console.log("▶ Example 1: BasicRemote + TV");
console.log("─────────────────────────────────");
const tv = new TV();
const basicRemote = new BasicRemote(tv);

basicRemote.togglePower();        // TV ON
basicRemote.volumeUp();           // Volume: 40
basicRemote.channelUp();          // Channel: 2
basicRemote.channelUp();          // Channel: 3

console.log("\n▶ Example 2: BasicRemote + Radio");
console.log("─────────────────────────────────");
const radio = new Radio();
const radioRemote = new BasicRemote(radio);

radioRemote.togglePower();        // Radio ON
radioRemote.volumeUp();           // Volume: 30
radioRemote.channelUp();          // FM: 102.5

console.log("\n▶ Example 3: AdvancedRemote + TV");
console.log("─────────────────────────────────");
const tv2 = new TV();
const advancedRemote = new AdvancedRemote(tv2);

advancedRemote.togglePower();     // TV ON
advancedRemote.volumeUp();        // Volume: 40
advancedRemote.mute();            // Volume: 0
advancedRemote.pictureInPicture(); // PIP enabled

console.log("\n▶ Example 4: AdvancedRemote + Radio");
console.log("─────────────────────────────────");
const radio2 = new Radio();
const advancedRadioRemote = new AdvancedRemote(radio2);

advancedRadioRemote.togglePower();     // Radio ON
advancedRadioRemote.mute();            // Volume: 0
advancedRadioRemote.pictureInPicture(); // Not supported

console.log("\n═══════════════════════════════════════════════");


// ════════════════════════════════════════════════════════════════════════════════
//                            WHY USE BRIDGE PATTERN?
// ════════════════════════════════════════════════════════════════════════════════

/**
 * WITHOUT BRIDGE PATTERN (Inheritance Explosion):
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * You'd need:
 * - BasicRemoteForTV
 * - BasicRemoteForRadio
 * - AdvancedRemoteForTV
 * - AdvancedRemoteForRadio
 *
 * If you add more devices (Projector, Soundbar) and more remotes (VoiceRemote):
 * Total classes = Remotes × Devices = 3 × 4 = 12 classes!
 *
 * WITH BRIDGE PATTERN:
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * - 3 Remote types (Basic, Advanced, Voice)
 * - 4 Device types (TV, Radio, Projector, Soundbar)
 * Total classes = Remotes + Devices = 3 + 4 = 7 classes
 *
 * Any remote can work with any device through composition!
 */
