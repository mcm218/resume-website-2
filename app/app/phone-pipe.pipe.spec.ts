import { PhonePipePipe } from './phone-pipe.pipe';

describe('PhonePipePipe', () => {
  it('create an instance', () => {
    const pipe = new PhonePipePipe();
    expect(pipe).toBeTruthy();
  });


  it('transforms "1234567890" to "(123) 456-7890"', () => {
    const pipe = new PhonePipePipe();
    expect(pipe.transform('1234567890')).toBe('(123) 456-7890');
  });
});
