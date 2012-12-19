



# Player Activity Timeline

* Player is initialized with player arguments passed in (or not)
* fetch data from the `url` attribute if `data` is not defined
* once data is fetched from the server (or passed in object) then detect which parser to use based on it's structure
* matching parser returns valid Zeega data back to the player
* the valid data is then parsed again by the player into `sequences`, `frames` (fames contain `layers`)
  * this process does a lot of precalculation about how the project can be navigated by determining adjacent frames (through position in the containing sequence, or by user defined links) and adjusting when to move layers on/off of the stage in the case of persistent layers (layers that exist over multiple frames). This data is then baked into the sequence, frame, & layer models.
  * every model is preloaded with a`status` object to allow access to info on the current status of the player and to allow player events to be triggered from anywhere via emit()
  * every model is preloaded with a `relay` object which the player is listening for changes to `current_frame` which triggers _remote_cueFrame() in the player.
* "data_loaded" event is fired
* player is rendered into the dom (appended to body or `div_id`)
* "ready" event is fired
* player tries to preload frame layers into player. frames/layers to preload are precalculated during the player parse phase
* as frames and layers preload their status changes from `waiting` > `loading` > 'ready'
* when all layers in a frame are preloaded, the frames fire a 'frame_ready' event to tell the player it's standing by.
* when the initial frame is preloaded, the player moves the frame's layers into view on the stage and triggers play events in each layer
* "play" is fired (the initial play event may be broken atm)
* the player now just waits for further instruction and continues to preload adjacent frames if not already loaded
* if the user presses the forward arrow key the player will try to cueNext() to render the next frame if available
  * frames can also call cueNext() if the `advance` property is set for a timed advance
  * layers can also cue an arbitrary frame through the relay object
* the existing frame is unrendered by moving child layers off stage and calling exit() on each layer
* the new frame is rendered by moving child layers on stage and calling play() on each layer
  * layers common to both frames are left on stage but the z-index property is updated to reflect the layer order of the new frame
* "frame_rendered" event is fired
* when player.destroy is called the player calls destroy() on each frame and layer before removing itself from the dom
