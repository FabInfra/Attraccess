import { Test } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('getInfo', () => {
    it('should return api information', () => {
      expect(service.getInfo()).toEqual({ name: 'FabAccess API', status: 'ok' });
    });
  });
});
