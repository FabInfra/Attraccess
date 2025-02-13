import { Api } from './index';

describe('ApiClient', () => {
  it('should be defined', () => {
    expect(Api).toBeDefined();
  });

  it('should be able to create a new instance', () => {
    const api = new Api();
    expect(api).toBeDefined();
  });
});
