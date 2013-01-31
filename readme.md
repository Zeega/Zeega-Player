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

the player constructor can take the following optional attributes:

* `cover` - Controls how the Player takes over its window. `true` - full-bleed. `false` - scales to fit. `horizontal` - scales so left and right are always in view but may crop or letterbox top and bottom. `vertical` - scales so top and bottom are always in view but may crop or letterbox left and right. Default: `false`.
* `data` - A json data object to be passed in, parsed, and played. Default: `null`.
* `debugEvents` - Choose which events that are output to the console. `true` - outputs all events. `false` - silent. `[event name]` - outputs only that event (see EVENTS section below). Default: `false`.
* `layerOptions` - Layer specific options to be passed into the player. Default: `null`.
* `preloadRadius` - The number of frames to load ahead (and behind). Default: 2.

## tasks

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

## Examples
Included are some examples of basic implementations of the Zeega player.
The examples generally require the use of a localhost to work in order to download data.
* example_00.html - dynamic flickr set
