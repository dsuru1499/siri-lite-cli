import { SiriLiteCliPage } from './app.po';

describe('siri-lite-cli App', () => {
  let page: SiriLiteCliPage;

  beforeEach(() => {
    page = new SiriLiteCliPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
