class MockPreferences {
  async remove(opt: { key: string }): Promise<void> {}
  async set(opt: { key: string; value: string | undefined }): Promise<void> {}
  async get(opt: { key: string }): Promise<{ value: string | null }> {
    return { value: 'test' };
  }
}

const Preferences = new MockPreferences();

export { Preferences };
