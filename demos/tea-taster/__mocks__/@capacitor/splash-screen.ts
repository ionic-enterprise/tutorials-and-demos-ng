class MockSplashScreen {
  async show(): Promise<void> {}
  async hide(): Promise<void> {}
}

const SplashScreen = new MockSplashScreen();

export { SplashScreen };
