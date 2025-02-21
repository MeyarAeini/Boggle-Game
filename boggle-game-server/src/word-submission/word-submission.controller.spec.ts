import { Test, TestingModule } from '@nestjs/testing';
import { WordSubmissionController } from './word-submission.controller';

describe('WordSubmissionController', () => {
  let controller: WordSubmissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WordSubmissionController],
    }).compile();

    controller = module.get<WordSubmissionController>(WordSubmissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
