const NPM_MODULE_NAME = '@react-native-firebase/app'
const NPM_MODULE_VERSION = '~6.2.0'

const IOS_INSERT_APPDELEGATE_1 = `@import Firebase;\n`;
const IOS_INSERT_APPDELEGATE_2 = `  [FIRApp configure];`;
const ANDROID_INSERT_BUILD_GRADLE = `        classpath("com.google.gms:google-services:4.2.0")`;
const ANDROID_GOOGLE_SERVICES_PLUGIN = `apply plugin: 'com.google.gms.google-services'\n`;

const ANDROID_PERF_BUILD_GRADLE = `        classpath("com.google.firebase:perf-plugin:1.3.1")`;
const ANDROID_PERF_PLUGIN = `apply plugin: 'com.google.firebase.firebase-perf'\n`;

const ANDROID_CRASHLYTICS_MAVEN = `        maven {\n          url("https://maven.fabric.io/public")\n        }`
const ANDROID_CRASHLYTICS_FABRIC_GRADLE = `        classpath("io.fabric.tools:gradle:1.28.1")`
const ANDROID_CRASHLYTICS_FABRIC_PLUGIN = `apply plugin: "io.fabric"`
const ANDROID_CRASHLYTICS_NDK = `\ncrashlytics {\n  enableNdk true\n}`

const UUID1 = `9D418FEC239FF80B00B0C90E`;
const UUID2 = `9D418FEB239FF80A00B0C90E`;
// Before /* End PBXBuildFile section */
const IOS_GOOGLE_SERCICE_FILE_1 = `		${UUID1} /* GoogleService-Info.plist in Resources */ = {isa = PBXBuildFile; fileRef = ${UUID2} /* GoogleService-Info.plist */; };`
// Before /* End PBXFileReference section */
const IOS_GOOGLE_SERCICE_FILE_2 = `		${UUID2} /* GoogleService-Info.plist */ = {isa = PBXFileReference; fileEncoding = 4; lastKnownFileType = text.plist.xml; path = "GoogleService-Info.plist"; sourceTree = "<group>"; };`;
// Before /* main.jsbundle */,
const IOS_GOOGLE_SERCICE_FILE_3 = `				${UUID2} /* GoogleService-Info.plist */,`;
// After /* Images.xcassets in Resources */
const IOS_GOOGLE_SERCICE_FILE_4 = `								${UUID1} /* GoogleService-Info.plist in Resources */,`
const UUID3 = `9D418FED239FFABA00B0C90E`;
// After /* Bundle React Native code and images */,
const IOS_EXTRA_SCRIPT_REF = `				${UUID3} /* ShellScript */,`;
// Before /* [CP] Check Pods Manifest.lock */ = {
const IOS_EXTRA_SCRIPT = `
		${UUID3} /* ShellScript */ = {
			isa = PBXShellScriptBuildPhase;
			buildActionMask = 2147483647;
			files = (
			);
			inputFileListPaths = (
			);
			inputPaths = (
			);
			outputFileListPaths = (
			);
			outputPaths = (
			);
			runOnlyForDeploymentPostprocessing = 0;
			shellPath = /bin/sh;
			shellScript = "\\"$\{PODS_ROOT\}/Fabric/run\\"";
		};
`

const createConfirmationMessage = (slug) => `You're ready to go! Check out https://invertase.io/oss/react-native-firebase/v6/${slug}/quick-start#module-usage to see how to use it!`;
const getModuleName = (slug) => `@react-native-firebase/${slug}`;

const MODULE_OPTIONS = [
  { 
    name: 'AdMob',
    module: getModuleName('admob'),
    warning: 'IMPORTANT: Ensure you update the "Contains ads" settings in the Google Play Store (via Pricing & Distribution tab).',
    confirmationMessage: createConfirmationMessage('admob'),
  },
  { 
    name: 'Analytics',
    module: getModuleName('analytics'),
    confirmationMessage: createConfirmationMessage('analytics'),
  },
  { 
    name: 'Authentication',
    module: getModuleName('auth'),
    confirmationMessage: createConfirmationMessage('auth'),
  },
  { 
    name: 'Cloud Firestore',
    module: getModuleName('firestore'),
    confirmationMessage: createConfirmationMessage('firestore'),
    dependencies: ['auth'],
  },
  { 
    name: 'Cloud Functions',
    module: getModuleName('functions'),
    confirmationMessage: createConfirmationMessage('functions'),
  },
  { 
    name: 'Cloud Messaging',
    module: getModuleName('messaging'),
    confirmationMessage: createConfirmationMessage('messaging'),
  },
  { 
    name: 'Cloud Storage',
    module: getModuleName('storage'),
    confirmationMessage: createConfirmationMessage('storage'),
  },
  { 
    name: 'Crashlytics',
    module: getModuleName('crashlytics'),
    confirmationMessage: createConfirmationMessage('crashlytics'),
    extraAddSteps: async (APP_PATH, { ignite, prompt, print, parameters }) => {
      const packageJSON = require(`${APP_PATH}/package.json`);
      const PROJECT_NAME = packageJSON.name;
      // iOS Setup
      ignite.patchInFile(`${APP_PATH}/ios/${PROJECT_NAME}.xcodeproj/project.pbxproj`, {
        insert: IOS_EXTRA_SCRIPT_REF,
        after: `\\/\\* Bundle React Native code and images \\*\\/,`
      });
      ignite.patchInFile(`${APP_PATH}/ios/${PROJECT_NAME}.xcodeproj/project.pbxproj`, {
        insert: IOS_EXTRA_SCRIPT,
        before: `\\/\\* \\[CP\\] Check Pods Manifest.lock \\*\\/ = {`
      });

      // Android Setup
      ignite.patchInFile(`${APP_PATH}/android/build.gradle`, {
        insert: ANDROID_CRASHLYTICS_MAVEN,
        after: `jcenter()`
      });
      ignite.patchInFile(`${APP_PATH}/android/build.gradle`, {
        insert: ANDROID_CRASHLYTICS_FABRIC_GRADLE,
        after: `dependencies {`
      });
      ignite.patchInFile(`${APP_PATH}/android/app/build.gradle`, {
        insert: ANDROID_CRASHLYTICS_FABRIC_PLUGIN,
        after: `apply plugin: "com.android.application"`
      });
      ignite.patchInFile(`${APP_PATH}/android/app/build.gradle`, {
        insert: ANDROID_CRASHLYTICS_NDK,
        after: `apply plugin: "io.fabric"`
      });
    },
    extraRemoveSteps: async (APP_PATH, { ignite, prompt, print }) => {
      const packageJSON = require(`${APP_PATH}/package.json`);
      const PROJECT_NAME = packageJSON.name;
      // iOS Setup
      ignite.patchInFile(`${APP_PATH}/ios/${PROJECT_NAME}.xcodeproj/project.pbxproj`, { delete: IOS_EXTRA_SCRIPT_REF });
      ignite.patchInFile(`${APP_PATH}/ios/${PROJECT_NAME}.xcodeproj/project.pbxproj`, { delete: IOS_EXTRA_SCRIPT });

      // Android Setup
      ignite.patchInFile(`${APP_PATH}/android/build.gradle`, { delete: ANDROID_CRASHLYTICS_MAVEN });
      ignite.patchInFile(`${APP_PATH}/android/build.gradle`, { delete: ANDROID_CRASHLYTICS_FABRIC_GRADLE });
      ignite.patchInFile(`${APP_PATH}/android/app/build.gradle`, { delete: ANDROID_CRASHLYTICS_FABRIC_PLUGIN });
      ignite.patchInFile(`${APP_PATH}/android/app/build.gradle`, { delete: ANDROID_CRASHLYTICS_NDK });
    },
  },
  { 
    name: 'Dynamic Links',
    module: getModuleName('dynamic-links'),
    confirmationMessage: createConfirmationMessage('dynamic-links'),
  },
  { 
    name: 'In-app Messaging',
    module: getModuleName('in-app-messaging'),
    confirmationMessage: createConfirmationMessage('in-app-messaging'),
  },
  { 
    name: 'Instance ID',
    module: getModuleName('iid'),
    confirmationMessage: createConfirmationMessage('iid'),
  },
  { 
    name: 'ML Kit Natural Language',
    module: getModuleName('ml-natural-language'),
    confirmationMessage: createConfirmationMessage('ml-natural-language'),
  },
  { 
    name: 'ML Kit Vision',
    module: getModuleName('ml-vision'),
    confirmationMessage: createConfirmationMessage('ml-vision'),
  },
  { 
    name: 'Performance Monitoring',
    module: getModuleName('perf'),
    confirmationMessage: createConfirmationMessage('perf'),
    extraAddSteps: async (APP_PATH, { ignite, patching }) => {
      ignite.patchInFile(`${APP_PATH}/android/build.gradle`, {
        insert: ANDROID_PERF_BUILD_GRADLE,
        after: `dependencies {`
      });
      patching.append(`${APP_PATH}/android/app/build.gradle`, ANDROID_PERF_PLUGIN);
    },
    extraRemoveSteps: async (APP_PATH, { ignite, patching }) => {
      ignite.patchInFile(`${APP_PATH}/android/build.gradle`, { delete: ANDROID_PERF_BUILD_GRADLE });
      ignite.patchInFile(`${APP_PATH}/android/app/build.gradle`, { delete: ANDROID_PERF_PLUGIN });
    },
  },
  { 
    name: 'Realtime Database',
    module: getModuleName('database'),
    confirmationMessage: createConfirmationMessage('database'),
  },
  { 
    name: 'Remote Config',
    module: getModuleName('remote-config'),
    confirmationMessage: createConfirmationMessage('remote-config'),
  },
]

const add = async function (toolbox) {
  // Learn more about toolbox: https://infinitered.github.io/gluegun/#/toolbox-api.md
  const { ignite, system, filesystem, print, patching, parameters } = toolbox

  const PLUGIN_PATH = __dirname;
  const APP_PATH = process.cwd();
  const packageJSON = require(`${APP_PATH}/package.json`);
  const PROJECT_NAME = packageJSON.name;

  if (parameters.options.help) {
    print.info(`
      Adding this plugin will help you install and configure Firebase for your React Native project.

      If you need to remove interactivity, you can specify most of the options as command-line parameters:
      
      --config-files-setup : Use if you already set the google-services.json and GoogleService-Info.plist
      
      --modules : Firebase modules to install, to select in: ${MODULE_OPTIONS.map((item) => item.name).join(', ')}

      ex: --modules=Analytics,"Cloud Functions" ("all" is also a valid value for --modules)
    `)
    process.exit();
  }

  if (packageJSON.dependencies['react-native'] < '0.60.0') {
    print.error('Sorry, this package supports only react-native@0.60.0+ right now');
    process.exit();
  }
  
  let isReady = parameters.options.configFilesSetup || await toolbox.prompt.confirm('Did you setup your project on the Firebase console and got the google services configuration files?');

  while (!isReady) {
    print.warning('Please follow the steps to get the credentials files from https://console.firebase.google.com/ as stated in:\n * Android: https://invertase.io/oss/react-native-firebase/quick-start/android-firebase-credentials\n * iOS: https://invertase.io/oss/react-native-firebase/quick-start/ios-firebase-credentials\n');

    const result = await system.run(`cd ${APP_PATH}/android && ./gradlew signingReport | grep "> Task :app:signingReport" -A 45 | grep "Variant: debugAndroidTest$" -A 8 | grep "SHA1:"`, { trimmed: true });
    
    const splitResult = result ? result.split(': ') : [];
    if (splitResult.length > 1 && splitResult[1]) {
      print.warning(`(optional) Your android Debug Signing certificate SHA1 is ${splitResult[1]}`);
    }

    print.warning('❌  DO NOT modify the native files, this plugin will take care of it  ⚠️');
    // print.warning('✅  DO drag and drop the GoogleService-Info.plist file into your .xcworkspace in XCode  ⚠️');

    isReady = await toolbox.prompt.confirm(`Got the google services configuration files set in ios/${packageJSON.name}/ and android/app/ ?`);
  }

  await ignite.addModule(NPM_MODULE_NAME, { link: false, version: NPM_MODULE_VERSION })

  const spinner = print.spin('Patching iOS files');
  // Patch AppDelegate.m for base config
  ignite.patchInFile(`${APP_PATH}/ios/${PROJECT_NAME}/AppDelegate.m`, {
    insert: IOS_INSERT_APPDELEGATE_1,
    before: `@implementation AppDelegate`
  });
  ignite.patchInFile(`${APP_PATH}/ios/${PROJECT_NAME}/AppDelegate.m`, {
    insert: IOS_INSERT_APPDELEGATE_2,
    before: `return YES;`
  });
  ignite.patchInFile(`${APP_PATH}/ios/${PROJECT_NAME}.xcodeproj/project.pbxproj`, {
    insert: IOS_GOOGLE_SERCICE_FILE_1,
    before: 'End PBXBuildFile section'
  });
  ignite.patchInFile(`${APP_PATH}/ios/${PROJECT_NAME}.xcodeproj/project.pbxproj`, {
    insert: IOS_GOOGLE_SERCICE_FILE_2,
    before: 'End PBXFileReference section'
  });
  ignite.patchInFile(`${APP_PATH}/ios/${PROJECT_NAME}.xcodeproj/project.pbxproj`, {
    insert: IOS_GOOGLE_SERCICE_FILE_3,
    after: 'main.jsbundle \\*\\/,'
  });
  ignite.patchInFile(`${APP_PATH}/ios/${PROJECT_NAME}.xcodeproj/project.pbxproj`, {
    insert: IOS_GOOGLE_SERCICE_FILE_4,
    before: 'Images.xcassets in Resources \\*\\/,'
  });
  spinner.succeed('Patched iOS files');

  spinner.text = 'Updating pods (this will probably take a while)';
  spinner.start();
  await system.spawn('pod install', { cwd: `${APP_PATH}/ios` });
  spinner.succeed('Updated pods');

  spinner.text = 'Patching Android files';
  spinner.start();
  // Patch android/build.gradle
  ignite.patchInFile(`${APP_PATH}/android/build.gradle`, {
    insert: ANDROID_INSERT_BUILD_GRADLE,
    after: `dependencies {`
  })
  // Patch android/app/build.gradle
  patching.append(`${APP_PATH}/android/app/build.gradle`, ANDROID_GOOGLE_SERVICES_PLUGIN);
  spinner.succeed('Patched Android files');
  
  let modulesToInstall;

  if (!parameters.options.modules) {
    const { submodules } = await toolbox.prompt.ask({
      type: 'multiselect',
      name: 'submodules',
      message: 'Which firebase services do you need?',
      choices: MODULE_OPTIONS,
    });

    modulesToInstall = submodules;
  } else if (parameters.options.modules === 'all') {
    modulesToInstall = MODULE_OPTIONS.map((item) => item.name);
  } else {
    modulesToInstall = parameters.options.modules.split(',').map((item) => item.trim());
  }

  for (let index = 0; index < modulesToInstall.length; index++) {
    const moduleName = modulesToInstall[index];
    const moduleOptions = MODULE_OPTIONS.find((item) => item.name === moduleName);

    print.warning(`Installing module ${moduleName}`);

    await ignite.addModule(moduleOptions.module, { link: false, version: NPM_MODULE_VERSION });

    if (moduleOptions.warning) {
      print.warning(moduleOptions.warning);
    }
    
    if (moduleOptions.extraAddSteps) {
      await moduleOptions.extraAddSteps(APP_PATH, toolbox);
    }
    
    if (moduleOptions.confirmationMessage) {
      print.success(moduleOptions.confirmationMessage);
    }
  }

  if (modulesToInstall.length > 0) {
    await system.spawn('pod install', { cwd: `${APP_PATH}/ios` });
  }

  print.success('You are all set!');
}

/**
 * Remove yourself from the project.
 */
const remove = async function (toolbox) {
  // Learn more about toolbox: https://infinitered.github.io/gluegun/#/toolbox-api.md
  const { ignite, system, filesystem, print, patching, parameters } = toolbox

  const PLUGIN_PATH = __dirname;
  const APP_PATH = process.cwd();
  const packageJSON = require(`${APP_PATH}/package.json`);
  const PROJECT_NAME = packageJSON.name;
  
  if (parameters.options.help) {
    print.info(`
      If you need to remove interactivity, you can specify most of the options as command-line parameters:
      
      --remove-config-files : Use if you want to remove the google-services.json and GoogleService-Info.plist files
      
      --modules : Firebase modules to remove, to select in: ${MODULE_OPTIONS.map((item) => item.name).join(', ')}

      ex: --modules=Analytics,"Cloud Functions" ("all" is also a valid value for --modules)
    `)
    process.exit();
  }

  let allOrSelected;
  if (!parameters.options.modules) {
    const { choice } = await toolbox.prompt.ask({
      type: 'select',
      name: 'choice',
      message: 'Do you want to remove the whole library, or just a part?',
      choices: [
        { name: 'EVERYTHING' },
        { name: 'ONLY SOME MODULES' },
      ],
    });

    allOrSelected = choice;
  }

  let submodulesToRemove = [];
  
  if (allOrSelected === 'EVERYTHING' || parameters.options.modules === 'all') {
    const removeConfigFiles = parameters.options.removeConfigFiles !== undefined 
      ? parameters.options.removeConfigFiles 
      : await toolbox.prompt.confirm(`Do you want us to remove the google services configuration files set in ios/${packageJSON.name}/ and android/app/ ?`);

    if (removeConfigFiles) {
      filesystem.delete(`${APP_PATH}/android/app/google-services.json`);
      filesystem.delete(`${APP_PATH}/ios/${PROJECT_NAME}/GoogleService-Info.plist`);

      // Remove reference from XCode proj
      if (parameters.options.removeConfigFiles !== undefined) {
        print.warning(`You still need to remove the GoogleService-Info.plist from your iOS project by opening ios/${PROJECT_NAME}.xcworkspace and delete it from the tree left.`);
      } else {
        let isIOSGoogleServiceFileRemoved = false;
        while (!isIOSGoogleServiceFileRemoved) {
          isIOSGoogleServiceFileRemoved = await toolbox.prompt.confirm(`You need to remove the GoogleService-Info.plist from your iOS project by opening ios/${PROJECT_NAME}.xcworkspace and delete it from the tree left. Once that's done, continue?`);
        }
      }
    }

    await ignite.removeModule(NPM_MODULE_NAME, { unlink: false })

    const spinner = print.spin('Unpatching iOS files');
    // Patch AppDelegate.m for base config
    ignite.patchInFile(`${APP_PATH}/ios/${PROJECT_NAME}/AppDelegate.m`, { delete: IOS_INSERT_APPDELEGATE_1 });
    ignite.patchInFile(`${APP_PATH}/ios/${PROJECT_NAME}/AppDelegate.m`, { delete: IOS_INSERT_APPDELEGATE_2 });
    ignite.patchInFile(`${APP_PATH}/ios/${PROJECT_NAME}.xcodeproj/project.pbxproj`, { delete: IOS_GOOGLE_SERCICE_FILE_1 });
    ignite.patchInFile(`${APP_PATH}/ios/${PROJECT_NAME}.xcodeproj/project.pbxproj`, { delete: IOS_GOOGLE_SERCICE_FILE_2 });
    ignite.patchInFile(`${APP_PATH}/ios/${PROJECT_NAME}.xcodeproj/project.pbxproj`, { delete: IOS_GOOGLE_SERCICE_FILE_3 });
    ignite.patchInFile(`${APP_PATH}/ios/${PROJECT_NAME}.xcodeproj/project.pbxproj`, { delete: IOS_GOOGLE_SERCICE_FILE_4 });
    spinner.succeed('Unpatched iOS files');

    spinner.text = 'Updating pods (this will probably take a while)';
    spinner.start();
    await system.spawn('pod install', { cwd: `${APP_PATH}/ios` });
    spinner.succeed('Updated pods');

    spinner.text = 'Unpatching Android files';
    spinner.start();
    // Patch android/build.gradle
    // WARNING: We might not want to remove the google-services there... A lot of other stuff are using that.
    // ignite.patchInFile(`${APP_PATH}/android/build.gradle`, { delete: ANDROID_INSERT_BUILD_GRADLE })
    // Patch android/app/build.gradle
    ignite.patchInFile(`${APP_PATH}/android/app/build.gradle`, { delete: ANDROID_GOOGLE_SERVICES_PLUGIN })
    spinner.succeed('Unpatched Android files');

    submodulesToRemove = MODULE_OPTIONS.map((item) => item.name);
  } else if (!parameters.options.modules) {
    const { submodules } = await toolbox.prompt.ask({
      type: 'multiselect',
      name: 'submodules',
      message: 'Which firebase services do you need?',
      choices: MODULE_OPTIONS,
    });

    submodulesToRemove = submodules;
  } else {
    submodulesToRemove = parameters.options.modules.split(',').map((item) => item.trim());
  }

  print.warning(submodulesToRemove)

  for (let index = 0; index < submodulesToRemove.length; index++) {
    const moduleName = submodulesToRemove[index];
    const moduleOptions = MODULE_OPTIONS.find((item) => item.name === moduleName);

    print.warning(`Removing module ${moduleName}`);

    try {
      await ignite.removeModule(moduleOptions.module, { unlink: false });

      if (moduleOptions.warning) {
        print.warning(moduleOptions.warning);
      }
      
      if (moduleOptions.extraRemoveSteps) {
        await moduleOptions.extraRemoveSteps(APP_PATH, toolbox);
      }
      
      if (moduleOptions.confirmationMessage) {
        print.success(`${moduleName} has been removed successfully`);
      }
    } catch (e) {
      print.warning(`Could not remove ${moduleName}: ${e.message}`)
    }
  }

  if (submodulesToRemove.length > 0) {
    await system.spawn('pod install', { cwd: `${APP_PATH}/ios` });
  }

  print.success('Farewell, my friend!');
}

// Required in all Ignite plugins
module.exports = { add, remove }

