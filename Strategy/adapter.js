/**
 * ADAPTER DESIGN PATTERN
 *
 * Purpose: Allows incompatible interfaces to work together by wrapping an object
 * with an incompatible interface inside an adapter that implements the expected interface.
 *
 * Key Components:
 * 1. Target Interface (MediaPlayer) - The interface the client expects
 * 2. Adaptee (OldVLcPlayer) - The existing class with incompatible interface
 * 3. Adapter (VLCAdapter) - Bridges the gap between Target and Adaptee
 * 4. Client (AudioPlayer) - Uses the Target interface
 *
 * When to use:
 * - When you want to use an existing class but its interface doesn't match what you need
 * - When you want to create a reusable class that cooperates with unrelated classes
 * - When integrating legacy code with new systems
 */

// Target Interface - defines the interface that the client expects
class MediaPlayer {
    play(audioType, fileName) {
        throw new Error("play() must be imlpemented")
    }
}

// Adaptee - the existing/legacy class with an incompatible interface
// This class has playVLCFile() but our client expects play()
class OldVLcPlayer {
    playVLCFile(fileName) {
      console.log("playing audio file", fileName)
    }
}

// Adapter - wraps the Adaptee and implements the Target interface
// Translates calls from the Target interface to the Adaptee's interface
class VLCAdapter extends MediaPlayer {
    constructor() {
        super();
        // Composition: Adapter holds an instance of the Adaptee
        this.vlc = new OldVLcPlayer();
    }

    // Implements the Target interface method
    // Internally delegates to the Adaptee's incompatible method
    play(audioType, fileName) {
        if(audioType === 'vlc') {
            this.vlc.playVLCFile();
        } else {
            console.log("can't play", audioType, "and this file", fileName)
        }
    }
}

// Client - uses the Target interface (MediaPlayer)
// Doesn't know about the Adaptee directly, only interacts through the Adapter
class AudioPlayer {
    constructor() {
      this.mediaAdapter = null;
    }

    play(audioType, fileName) {
      // Native support for MP3
      if (audioType.toLowerCase() === "mp3") {
        console.log(`Playing MP3 file: ${fileName}`);
      }
      // Uses Adapter for VLC format - bridges to legacy OldVLcPlayer
      else if (audioType.toLowerCase() === "vlc") {
        this.mediaAdapter = new VLCAdapter();
        this.mediaAdapter.play(audioType, fileName);
      } else {
        console.log(`Format ${audioType} is not supported`);
      }
    }
  }

// ── Usage ───────────────────────────────────────────────
const player = new AudioPlayer();

player.play("mp3", "song.mp3");   // Native support
player.play("vlc", "movie.vlc"); // Uses adapter to play via OldVLcPlayer
player.play("avi", "movie.avi"); // Unsupported format