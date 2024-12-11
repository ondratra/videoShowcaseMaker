# Video Showcase Maker

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

Video Showcase Maker is a tool for recording and creating videos showcasing features of web projects.
It can be used to create a video tutorials, guides, or frontend regression tests (although you'll be better off
with tools like [Playwright](https://playwright.dev) for serious testing).

Example videos created by this tool can be seen on my other project
[Crypto Formulas](https://crypto-formulas.com) homepage.

## Dependencies
You need to have [Font Awesome](https://fontawesome.com) loaded inside your webpage where Video Showcase Maker
will be running.

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
into individual scenes assuming you've used clapboard (see [staging plugin example](./examples/003_staging/index.html)).
It assumes video is in a format supported by `ffmpeg` and exports 4K and FullHD video outputs.

You can use tools like [OBS Studio](https://obsproject.com) to record the video itself.

```
VIDEO_NAME=myVideo # use your name
./scripts/videoCutter.sh ${VIDEO_NAME}.mkv ${VIDEO_NAME}_output.mkv
```
Resulting videos will be saved into `dist/cutterOutput/` folder.
See more information in log located at`dist/cutterOutput/debug.txt`.
