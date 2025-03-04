interface PrivacyScreenConfig {
  android?: { dimBackground?: boolean; privacyModeOnActivityHidden?: 'none' | 'dim' | 'splash' };
  ios?: { blurEffect?: 'light' | 'dark' | 'none' };
}

class MockPrivacyScreen {
  async enable(config?: PrivacyScreenConfig | undefined): Promise<void> {}
  async disable(): Promise<void> {}
  async isEnabled(): Promise<{ enabled: boolean }> {
    return { enabled: false };
  }
}

export const PrivacyScreen = new MockPrivacyScreen();
