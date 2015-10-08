# appshell-generator
A command-line utility to generate and build cordova apps for manifest-enabled web applications. Specify a shellfile.json containing configuration for your app, including icon and splashcreen assets, cordova plugins to include and target platforms.

## Usage
Create a shellfile.json file in your working directory and run the appshell-generator command:
```bash
$ appshell-generator
```

## Supported platforms and build targets
appshell-generator supports OSX, Linux and Windows.
Build targets can be ios, android or windows. 
Refer to https://cordova.apache.org/docs/en/5.1.1/guide/cli/index.html#link-1 for more information.

## Example shellfile.json
```json
{
    "name": "Demo13",
    "displayName": "Demo 13",
    "identifier": "com.acresta.acdemo13",
    "answerspace": "https://acresta.eps.blinkm.co/demo13",
    "icon": "/Users/jackson/Desktop/logo.png",
    "splash": "/Users/jackson/Desktop/splash.png",
    "platform": ["ios", "android"],
    "plugins": [
        "cordova-plugin-device",
        "cordova-plugin-geolocation",
        "cordova-plugin-camera",
        "cordova-plugin-media-capture",
        "cordova-plugin-media",
        "cordova-plugin-file",
        "cordova-plugin-splashscreen",
        "cordova-plugin-inappbrowser"
    ]
}
```
