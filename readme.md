![Zeega](https://raw.github.com/Zeega/Zeega-Core/master/web/images/zeega-logo-large.png)

# Zeega Player

This is the chromeless player which is at the heart of anything that playsback a Zeega

## Constructor

with a url datasource:

``` javascript
var zp = new Zeega.player({ url: "http://www.zeega.com/api/items/1234" });
```
with a data object:

``` javascript
var zp = new Zeega.player({ data: dataObject });
```

### Attributes

the player constructor can take the following optional attributes:

* `autoplay` - Will render and play the project as soon as it's ready. Default: `true`
* `cover` - Controls how the Player takes over its window. `true` - full-bleed. `false` - scales to fit. `horizontal` - scales so left and right are always in view but may crop or letterbox top and bottom. `vertical` - scales so top and bottom are always in view but may crop or letterbox left and right. Default: `false`.
* `data` - A json data object to be passed in, parsed, and played. Default: `null`.
* `debugEvents` - Choose which events that are output to the console. `true` - outputs all events. `false` - silent. `[event name]` - outputs only that event (see EVENTS section below). Default: `false`.
* `layerOptions` - Layer specific options to be passed into the player. Default: `null`.
* `preloadRadius` - The number of frames to load ahead (and behind). Default: 2.
* `collectionMode` - Defines how a passed in Zeega collection will behave. `standard` - linear Zeega. `slideshow` - displays collection as a slideshow. Default: `standard`.
* `fadeIn` - Time in ms that the player takes to fade in upon rendering. Default: `500`.
* `fadeOut` - Time in ms that the player takes to fade out upon calling `destroy()`. Default: `500`.
* `next` - selector of element used to cueNext the Zeega. Default: `null`.
* `prev` - selector of element used to cuePrev the Zeega. Default: `null`.
* `startFrame` - The ID of the frame to start the Zeega on. Default: `null`.
* `target` - The element that the player should render to. Accepts Selector or jQuery. Default: `null`.
* `url` - The url to a data source to be parsed

### Events

* `data_loaded` - data is loaded and parsed.
* `ready` - player is rendered into the dom.
* `layer_loading` - layer has been called to preload.
* `layer_ready` - layer is in the dom and media has preloaded and accounted for.
* `frame_ready` - frame and all it's layers have been preloaded and are staged but has not started to play.
* `frame_rendered` - frame is in view and has started to play.
* `can_play` - the project is ready and should be able to play.
* `ended` - a time based layer has ended.
* `sequence_enter` - a new sequence has started.
## tasks

## Developer

### update submodules

```bash
git submodule update --init --recursive
```

### commit changes to submodule

```bash
cd [path of submodule]
git commit -am 'message'
git push origin master
```

### copy relevant layer files (html,less) after editing

```bash
bbb comp
or
bbb release
```