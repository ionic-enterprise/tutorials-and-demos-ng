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
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", exact: "8.5.0"),
        .package(name: "CapacitorApp", path: "../../../../../node_modules/.pnpm/@capacitor+app@8.1.1_@capacitor+core@8.5.0/node_modules/@capacitor/app"),
        .package(name: "CapacitorHaptics", path: "../../../../../node_modules/.pnpm/@capacitor+haptics@8.0.2_@capacitor+core@8.5.0/node_modules/@capacitor/haptics"),
        .package(name: "CapacitorKeyboard", path: "../../../../../node_modules/.pnpm/@capacitor+keyboard@8.0.5_@capacitor+core@8.5.0/node_modules/@capacitor/keyboard"),
        .package(name: "CapacitorPrivacyScreen", path: "../../../../../node_modules/.pnpm/@capacitor+privacy-screen@2.0.1_@capacitor+core@8.5.0/node_modules/@capacitor/privacy-screen"),
        .package(name: "CapacitorStatusBar", path: "../../../../../node_modules/.pnpm/@capacitor+status-bar@8.0.3_@capacitor+core@8.5.0/node_modules/@capacitor/status-bar"),
        .package(name: "IonicEnterpriseAuth", path: "../../../../../node_modules/.pnpm/@ionic-enterprise+auth@8.1.0_@capacitor+core@8.5.0/node_modules/@ionic-enterprise/auth"),
        .package(name: "IonicEnterpriseIdentityVault", path: "../../capacitor-cordova-ios-plugins/sources/IonicEnterpriseIdentityVault"),
        .package(name: "@ionic-enterprise/secure-storage", path: "../../../../../node_modules/.pnpm/@ionic-enterprise+secure-storage@3.1.0_patch_hash=f4dd32134c270538fa4ea0b4b985de0bd32c2_cac6e14f0099fce6efee1b540b642b44/node_modules/@ionic-enterprise/secure-storage")
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
                .product(name: "IonicEnterpriseAuth", package: "IonicEnterpriseAuth"),
                .product(name: "IonicEnterpriseIdentityVault", package: "IonicEnterpriseIdentityVault"),
                .product(name: "@ionic-enterprise/secure-storage", package: "@ionic-enterprise/secure-storage")
            ]
        )
    ]
)
