import { BaseProject } from './app.po';

describe('base-project App', () => {
  let page: BaseProject;

  beforeEach(() => {
    page = new BaseProject();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
