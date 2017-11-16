const NPM_MODULE_NAME = 'react-native-firebase'
const EXAMPLE_FILE = 'FirebaseExample.js'
const APP_PATH = process.cwd()
const PROJECT_NAME = process.cwd().split('/').pop()

const GRADLE_CONFIG_COMPILE = `    compile(project(':react-native-firebase')) {
        transitive = false
  }
    compile "com.google.firebase:firebase-core:11.0.0"
    compile "com.google.firebase:firebase-ads:11.0.0"
    compile "com.google.firebase:firebase-analytics:11.0.0"
    compile "com.google.firebase:firebase-auth:11.0.0"
    compile "com.google.firebase:firebase-config:11.0.0"
    compile "com.google.firebase:firebase-crash:11.0.0"
    compile "com.google.firebase:firebase-database:11.0.0"
    compile "com.google.firebase:firebase-messaging:11.0.0"
    compile "com.google.firebase:firebase-perf:11.0.0"
    compile "com.google.firebase:firebase-storage:11.0.0"`

const ANDROID_IMPORTS = `import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.admob.RNFirebaseAdMobPackage; //Firebase AdMob
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage; // Firebase Analytics
import io.invertase.firebase.auth.RNFirebaseAuthPackage; // Firebase Auth
import io.invertase.firebase.config.RNFirebaseRemoteConfigPackage; // Firebase Remote Config
import io.invertase.firebase.crash.RNFirebaseCrashPackage; // Firebase Crash Reporting
import io.invertase.firebase.database.RNFirebaseDatabasePackage; // Firebase Realtime Database
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage; // Firebase Cloud Messaging
import io.invertase.firebase.perf.RNFirebasePerformancePackage; // Firebase Messaging
import io.invertase.firebase.storage.RNFirebaseStoragePackage; // Firebase Storage`

const ANDROID_PACKAGES = `           new RNFirebasePackage(),
           new RNFirebaseAdMobPackage(),
           new RNFirebaseAnalyticsPackage(),
           new RNFirebaseAuthPackage(),
           new RNFirebaseRemoteConfigPackage(),
           new RNFirebaseCrashPackage(),
           new RNFirebaseDatabasePackage(),
           new RNFirebaseMessagingPackage(),
           new RNFirebasePerformancePackage(),
           new RNFirebaseStoragePackage(),`

const ANDROID_SETTINGS = `include ':react-native-firebase'
project(':react-native-firebase').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-firebase/android')`

const ANDROID_PERMISSIONS = `<uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>`

const OLD_ANDROID_PERMISSIONS = `<uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>`

const ANDROID_MESSAGING_SERVICE = `      <service
        android:name="io.invertase.firebase.messaging.MessagingService"
        android:enabled="true"
        android:exported="true">
        <intent-filter>
          <action android:name="com.google.firebase.MESSAGING_EVENT" />
        </intent-filter>
      </service>
      <service android:name="io.invertase.firebase.messaging.InstanceIdService" android:exported="false">
        <intent-filter>
          <action android:name="com.google.firebase.INSTANCE_ID_EVENT"/>
        </intent-filter>
      </service>`

const MESSAGING_FUNCTIONS_IOS = `-(void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  [RNFirebaseMessaging didReceiveLocalNotification:notification];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo {
  [RNFirebaseMessaging didReceiveRemoteNotification:userInfo];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo
fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
  [RNFirebaseMessaging didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
`

const add = async function (context) {
  // Learn more about context: https://infinitered.github.io/gluegun/#/context-api.md
  const { ignite, filesystem } = context

  // install a npm module
  await ignite.addModule(NPM_MODULE_NAME, { link: false })

  await ignite.addPluginComponentExample(EXAMPLE_FILE, { title: 'Firebase Example' })

  // Copy Podfile to correct place
  if (!filesystem.exists(`${APP_PATH}/ios/Podfile`)) {
    filesystem.copy(`${__dirname}/templates/Podfile`, `${APP_PATH}/ios/Podfile`)
  }

  // Patch AppDelegate.m
  ignite.patchInFile(`${APP_PATH}/ios/${PROJECT_NAME}/AppDelegate.m`, {
    insert: `#import <Firebase.h>\n#import "RNFirebaseMessaging.h"`,
    after: `#import <React/RCTRootView.h>`
  })
  ignite.patchInFile(`${APP_PATH}/ios/${PROJECT_NAME}/AppDelegate.m`, {
    insert: `[FIRApp configure];\n[[UNUserNotificationCenter currentNotificationCenter] setDelegate:self];`,
    before: `return YES;`
  })
  ignite.patchInFile(`${APP_PATH}/ios/${PROJECT_NAME}/AppDelegate.m`, {
    insert: `${MESSAGING_FUNCTIONS_IOS}`,
    before: `@end`
  })
  // Patch AppDelegate.h
  ignite.patchInFile(`${APP_PATH}/ios/${PROJECT_NAME}/AppDelegate.h`, {
    insert: `@import UserNotifications;`,
    after: `#import <UIKit/UIKit.h>`
  })
  ignite.patchInFile(`${APP_PATH}/ios/${PROJECT_NAME}/AppDelegate.h`, {
    insert: `@interface AppDelegate : UIResponder <UIApplicationDelegate,UNUserNotificationCenterDelegate>`,
    replace: `@interface AppDelegate : UIResponder <UIApplicationDelegate>`
  })
  // Patch android/build.gradle
  ignite.patchInFile(`${APP_PATH}/android/build.gradle`, {
    insert: `classpath 'com.google.gms:google-services:3.0.0'`,
    after: `classpath 'com.android.tools.build:gradle:2.2.3'`
  })
  // Patch android/app/build.gradle
  ignite.patchInFile(`${APP_PATH}/android/app/build.gradle`, {
    insert: `apply plugin: 'com.google.gms.google-services'\n`,
    before: `// Run this once to be able to run the application with BUCK`
  })
  ignite.patchInFile(`${APP_PATH}/android/app/build.gradle`, {
    insert: `${GRADLE_CONFIG_COMPILE}`,
    after: `dependencies {`
  })
  // Patch MainApplivation.java
  ignite.patchInFile(`${APP_PATH}/android/app/src/main/java/com/${PROJECT_NAME}/MainApplication.java`, {
    insert: `${ANDROID_IMPORTS}`,
    after: `import com.facebook.react.ReactApplication;`
  })
  ignite.patchInFile(`${APP_PATH}/android/app/src/main/java/com/${PROJECT_NAME}/MainApplication.java`, {
    insert: `${ANDROID_PACKAGES}`,
    after: `new MainReactPackage()`
  })
  // Patch android/app/src/main/AndroidManifest.xml
  ignite.patchInFile(`${APP_PATH}/android/app/src/main/AndroidManifest.xml`, {
    insert: `${ANDROID_PERMISSIONS}`,
    replace: `${OLD_ANDROID_PERMISSIONS}`
  })
  ignite.patchInFile(`${APP_PATH}/android/app/src/main/AndroidManifest.xml`, {
    insert: `        android:launchMode="singleTop"`,
    before: `android:windowSoftInputMode="adjustResize"`
  })
  ignite.patchInFile(`${APP_PATH}/android/app/src/main/AndroidManifest.xml`, {
    insert: `${ANDROID_MESSAGING_SERVICE}`,
    before: `</application>`
  })
}

/**
 * Remove yourself from the project.
 */
const remove = async function (context) {
  // Learn more about context: https://infinitered.github.io/gluegun/#/context-api.md
  const { ignite, filesystem } = context

  // remove the npm module and unlink it
  await ignite.removeModule(NPM_MODULE_NAME, { unlink: false })

  await ignite.removePluginComponentExample(EXAMPLE_FILE)

  // remove Podfile
  if (filesystem.exists(`${APP_PATH}/ios/Podfile`)) {
    filesystem.remove(`${APP_PATH}/ios/Podfile`)
  }

  // Patch AppDelegate.m
  ignite.patchInFile(`${APP_PATH}/ios/${PROJECT_NAME}/AppDelegate.m`, {
    delete: `#import <Firebase.h>\n#import "RNFirebaseMessaging.h"`
  })
  ignite.patchInFile(`${APP_PATH}/ios/${PROJECT_NAME}/AppDelegate.m`, {
    delete: `[FIRApp configure];\n[[UNUserNotificationCenter currentNotificationCenter] setDelegate:self];`
  })
  ignite.patchInFile(`${APP_PATH}/ios/${PROJECT_NAME}/AppDelegate.m`, {
    delete: `${MESSAGING_FUNCTIONS_IOS}`
  })
  // Patch AppDelegate.h
  ignite.patchInFile(`${APP_PATH}/ios/${PROJECT_NAME}/AppDelegate.h`, {
    delete: `@import UserNotifications;`
  })
  ignite.patchInFile(`${APP_PATH}/ios/${PROJECT_NAME}/AppDelegate.h`, {
    insert: `@interface AppDelegate : UIResponder <UIApplicationDelegate>`,
    replace: `@interface AppDelegate : UIResponder <UIApplicationDelegate,UNUserNotificationCenterDelegate>`
  })
  // Patch android/build.gradle
  ignite.patchInFile(`${APP_PATH}/android/build.gradle`, {
    delete: `classpath 'com.google.gms:google-services:3.0.0'`
  })
  // Patch android/app/build.gradle
  ignite.patchInFile(`${APP_PATH}/android/app/build.gradle`, {
    delete: `apply plugin: 'com.google.gms.google-services'\n`
  })
  ignite.patchInFile(`${APP_PATH}/android/app/build.gradle`, {
    delete: `${GRADLE_CONFIG_COMPILE}`
  })
  // Patch MainApplivation.java
  ignite.patchInFile(`${APP_PATH}/android/app/src/main/java/com/${PROJECT_NAME}/MainApplication.java`, {
    delete: `${ANDROID_IMPORTS}`
  })
  ignite.patchInFile(`${APP_PATH}/android/app/src/main/java/com/${PROJECT_NAME}/MainApplication.java`, {
    delete: `${ANDROID_PACKAGES}`
  })
  // Patch android/settings.gradle
  ignite.patchInFile(`${APP_PATH}/android/settings.gradle`, {
    delete: `${ANDROID_SETTINGS}`
  })
  // Patch android/app/src/main/AndroidManifest.xml
  ignite.patchInFile(`${APP_PATH}/android/app/src/main/AndroidManifest.xml`, {
    insert: `${OLD_ANDROID_PERMISSIONS}`,
    replace: `${ANDROID_PERMISSIONS}`
  })
  ignite.patchInFile(`${APP_PATH}/android/app/src/main/AndroidManifest.xml`, {
    delete: `        android:launchMode="singleTop"`
  })
  ignite.patchInFile(`${APP_PATH}/android/app/src/main/AndroidManifest.xml`, {
    delete: `${ANDROID_MESSAGING_SERVICE}`
  })

  // Example of removing App/Firebase folder
  // const removeFirebase = await context.prompt.confirm(
  //   'Do you want to remove App/Firebase?'
  // )
  // if (removeFirebase) { filesystem.remove(`${APP_PATH}/App/Firebase`) }

  // Example of unpatching a file
  // ignite.patchInFile(`${APP_PATH}/App/Config/AppConfig.js`, {
  //   delete: `import '../Firebase/Firebase'\n`
  // )
}

// Required in all Ignite plugins
module.exports = { add, remove }

