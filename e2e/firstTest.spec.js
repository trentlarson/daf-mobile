describe('Sanity Tests', () => {
  before(async () => {
    await device.resetContentAndSettings()
  })
  beforeEach(async () => {
    await device.launchApp({ delete: true })
  })

  it('Create Identity', async () => {
    const getStartedBtn = await element(by.text('Get Started'))
    await getStartedBtn.tap()

    //Click Create Identity button
    const createIdBtn = await element(by.text('Create New Identity'))
    await createIdBtn.tap()

    // Verify that home screen is displayed
    const homeText = await element(by.text('Hey there,'))
    await expect(homeText).toHaveText('Hey there,')
    //const menuBtn = await element(by.id('Get started'));

    //Click Profile menu
    const profileBtn = await element(by.label('ViewerProfile, tab, 5 of 5'))
    await profileBtn.tap()

    //verify that a did is created**/
    const profileTitle = await element(by.text('My Profile'))
    await expect(profileTitle).toHaveText('My Profile')
  })
  after(async () => {
    //await device.uninstallApp()
  })
})
