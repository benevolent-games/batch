
# `@benev/batch`

***command-line tool for compressing media files in bulk.***

- batch makes it a pleasure to convert all your media files
- batch operates on directories (not per-file)
- batch is great for your build script
- batch is a one-stop shop for:
  - audio files
  - 3d glb files
  - images

<br/>

## just run `npx @benev/batch --help`

![](https://imgur.com/Y4r1zh0.png)

- after running the command, you should see this help page.
- ask for --help about each specific command for more details, eg
  ```sh
  npx @benev/batch images webp --help
  ```

<br/>

## example: compress images

take all the image files from `src/` directory, and then emit compressed webp files into `dist/`:

```sh
npx @benev/batch images webp --in="src" --out="dist" --quality="80"
```

of course, this is recursive, the directory structure for each file will be maintained in the output.

read the `--help` pages for more info.

<br/>

## for automated builds

### prelude: context and rationale
- okay, so you've got a typical `build` script in your `package.json`, where you run typescript or whatever
  - you probably have a `src` directory with your "source code"
  - you probably have a `dist` directory with your "build artifacts"
- what you want to do, is a similar thing for your media files
  - just like you have "source code", you want to have "source media", which is the highest quality version of the images/audio/glb files that you have
  - then, you want to include a `@benev/batch` step in your build process to compress all your media files down to the shippable versions
- then, you'll have the freedom to change the format or compression settings of all your media files at any time, by tweaking your build step

### package.json script
- install batch locally:
  ```sh
  npm i --save-dev @benev/batch
  ```
- now you can use it in your package.json scripts as just `batch`:
  ```json
  "scripts": {
    "build": "batch images webp --in=src --out=dist --quality=80"
  },
  ```
- and now when you `npm run build` you'll get all these nice webp images under your `dist` directory
- that's basically what's up
- for coordinating multiple build steps, look into [npm-run-all](https://www.npmjs.com/package/npm-run-all), i use it all the time

