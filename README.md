# Ignite Firebase Plugin

#### THIS PLUGIN IS STILL IN VERY EARLY STAGE. USE AT OWN RISK.


This plugin adds [react-native-firebase](https://github.com/invertase/react-native-firebase)
to your [Ignite](https://github.com/infinitered/ignite) React Native project and
configures it so it works out of the box with Ignite projects.

## Usage
First go through [initial setup](http://invertase.io/react-native-firebase/#/initial-setup) and get the GoogleService-Info.plist and google-services.json files ready and in the correct places. After that run:
(if you don't have CocoaPods installed check [installation instructions for CocoaPods](https://guides.cocoapods.org/using/getting-started.html#getting-started))


```
$ ignite add firebase
$ cd ios && pod install
```

This adds `ignite-firebase`.

If you want to use FCM for push notifications please check [3.1 and 3.2](http://invertase.io/react-native-firebase/#/installation-ios?id=_31-set-up-certificates)

## Contributing

1. Clone this repo
2. Run `npm install`
3. Run `npm test`
4. Check out a branch and make your changes
5. Write tests for those changes
6. Submit a pull request back upstream to dev

## License

- MIT