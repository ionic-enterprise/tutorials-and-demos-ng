// swift-tools-version: 5.9
import PackageDescription

// DO NOT MODIFY THIS FILE - managed by Capacitor CLI commands
let package = Package(
    name: "CapApp-SPM",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "CapApp-SPM",
            targets: ["CapApp-SPM"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", exact: "8.3.0"),
        .package(name: "CapacitorApp", path: "../../../../../node_modules/.pnpm/@capacitor+app@8.1.0_@capacitor+core@8.3.0/node_modules/@capacitor/app"),
        .package(name: "CapacitorHaptics", path: "../../../../../node_modules/.pnpm/@capacitor+haptics@8.0.2_@capacitor+core@8.3.0/node_modules/@capacitor/haptics"),
        .package(name: "CapacitorKeyboard", path: "../../../../../node_modules/.pnpm/@capacitor+keyboard@8.0.2_@capacitor+core@8.3.0/node_modules/@capacitor/keyboard"),
        .package(name: "CapacitorPrivacyScreen", path: "../../../../../node_modules/.pnpm/@capacitor+privacy-screen@2.0.1_@capacitor+core@8.3.0/node_modules/@capacitor/privacy-screen"),
        .package(name: "CapacitorStatusBar", path: "../../../../../node_modules/.pnpm/@capacitor+status-bar@8.0.2_@capacitor+core@8.3.0/node_modules/@capacitor/status-bar"),
        .package(name: "IonicEnterpriseIdentityVault", path: "../../capacitor-cordova-ios-plugins/sources/IonicEnterpriseIdentityVault")
    ],
    targets: [
        .target(
            name: "CapApp-SPM",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm"),
                .product(name: "CapacitorApp", package: "CapacitorApp"),
                .product(name: "CapacitorHaptics", package: "CapacitorHaptics"),
                .product(name: "CapacitorKeyboard", package: "CapacitorKeyboard"),
                .product(name: "CapacitorPrivacyScreen", package: "CapacitorPrivacyScreen"),
                .product(name: "CapacitorStatusBar", package: "CapacitorStatusBar"),
                .product(name: "IonicEnterpriseIdentityVault", package: "IonicEnterpriseIdentityVault")
            ]
        )
    ]
)
