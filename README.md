# Video Showcase Maker

## Dependencies
You need to have [Font Awesome](https://fontawesome.com) loaded inside your browser where Video Showcase Maker will be running.

## Install
```
yarn
yarn build
```

## Examples
```
yarn examplesServer # starts http server
```
Now you can see examples in your browser at http://127.0.0.1:8080/examples.

## Video post production

While Video Showcase Maker doesn't focus on recording the video itself, it provides a tool that splits the video
to individual scenes assuming you've used clapboard (see [staging plugin example](./examples/003_staging/index.html)).
It assumes video is in a format supported by `ffmpeg` and exports 4K and FullHD video outputs.

```
VIDEO_NAME=myVideo # use your name
./scripts/videoCutter.sh ${VIDEO_NAME}.mkv ${VIDEO_NAME}_output.mkv
```
Resulting videos will be saved into `dist/cutterOutput/` folder.
See more information in log located at`dist/cutterOutput/debug.txt`.
