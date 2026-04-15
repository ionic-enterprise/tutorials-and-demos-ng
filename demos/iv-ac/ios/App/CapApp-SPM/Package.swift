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
        .package(name: "CapacitorPreferences", path: "../../../../../node_modules/.pnpm/@capacitor+preferences@8.0.1_@capacitor+core@8.3.0/node_modules/@capacitor/preferences"),
        .package(name: "CapacitorPrivacyScreen", path: "../../../../../node_modules/.pnpm/@capacitor+privacy-screen@2.0.1_@capacitor+core@8.3.0/node_modules/@capacitor/privacy-screen"),
        .package(name: "CapacitorShare", path: "../../../../../node_modules/.pnpm/@capacitor+share@8.0.1_@capacitor+core@8.3.0/node_modules/@capacitor/share"),
        .package(name: "IonicEnterpriseAuth", path: "../../../../../node_modules/.pnpm/@ionic-enterprise+auth@8.0.0_@capacitor+core@8.3.0/node_modules/@ionic-enterprise/auth"),
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
                .product(name: "CapacitorPreferences", package: "CapacitorPreferences"),
                .product(name: "CapacitorPrivacyScreen", package: "CapacitorPrivacyScreen"),
                .product(name: "CapacitorShare", package: "CapacitorShare"),
                .product(name: "IonicEnterpriseAuth", package: "IonicEnterpriseAuth"),
                .product(name: "IonicEnterpriseIdentityVault", package: "IonicEnterpriseIdentityVault")
            ]
        )
    ]
)
