# Ignite Firebase Plugin

#### THIS PLUGIN IS STILL IN VERY EARLY STAGE. USE AT OWN RISK.

This plugin adds [react-native-firebase](https://github.com/invertase/react-native-firebase) to your [Ignite](https://github.com/infinitered/ignite) React Native project and configures it so it works out of the box with Ignite projects.

## Compatibility

This version supports [react-native-firebase](https://github.com/invertase/react-native-firebase) `v6` and therefore is only compatible with [react-native](https://facebook.github.io/react-native) 0.60.0+

## Usage

First get the credentials files from https://console.firebase.google.com/ as stated in:

 * Android: https://invertase.io/oss/react-native-firebase/quick-start/android-firebase-credentials
 * iOS: https://invertase.io/oss/react-native-firebase/quick-start/ios-firebase-credentials\n

And put them:
* `google-services.json` in `android/app/`
* `GoogleService-Info.plist` in `ios/YourApp/`

❌  DO NOT modify the native files, this plugin will take care of it  ⚠️

### Adding Firebase

Then:

```sh
ignite add firebase
```

You can also pass some information directly as CLI paramaters when adding the plugin: 

* `--config-files-setup` : Use if you already set the google-services.json and GoogleService-Info.plist in your project
* `--modules` : Firebase modules to install, to select in: 
    * `AdMob`
    * `Analytics`
    * `Authentication`
    * `Cloud Firestore`
    * `Cloud Functions`
    * `Cloud Messaging`
    * `Cloud Storage`
    * `Crashlytics`
    * `Dynamic Links`
    * `In-app Messaging`
    * `Instance ID`
    * `ML Kit Natural Language`
    * `ML Kit Vision`
    * `Performance Monitoring`
    * `Realtime Database`
    * `Remote Config`

Examples:

```
ignite add firebase --modules=Analytics,"Cloud Functions"
ignite add firebase --modules=all
ignite add firebase --modules=Crashlytics --config-files-setup
```

You can get this information by using:

```sh
ignite add firebase --help
```

### Removing Firebase

```sh
ignite remove firebase
```

Same here, you can use CLI parameters to convey some information:

* `--remove-config-files` : Use if you want to remove the google-services.json and GoogleService-Info.plist files
* `--modules` : Firebase modules to remove,  see above for more examples

You can get this information by using:

```sh
ignite remove firebase --help
```

## Contributing

1. Clone this repo
2. Run `npm install`
3. Run `npm test`
4. Check out a branch and make your changes
5. Write tests for those changes
6. Submit a pull request back upstream to dev

## License

- MIT
