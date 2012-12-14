![Zeega](https://raw.github.com/Zeega/Zeega-Core/master/web/images/zeega-logo-large.png)

# Zeega Player

##Dependencies

* jquery 1.8+

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
