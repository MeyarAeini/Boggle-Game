import { Test, TestingModule } from '@nestjs/testing';
import { WordSubmissionService } from './word-submission.service';

describe('WordSubmissionService', () => {
  let service: WordSubmissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WordSubmissionService],
    }).compile();

    service = module.get<WordSubmissionService>(WordSubmissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
