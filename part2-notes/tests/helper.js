const loginWith = async (page, username, password)  => {
  await page.getByRole('button', { name: 'log in' }).click()
  const textboxes = await page.getByRole('textbox').all()
  await textboxes[0].fill('mluukkai')
  await textboxes[1].fill('salainen')
  await page.getByRole('button', { name: 'login' }).click()
}

const createNote = async (page, content) => {
  await page.getByRole('button', { name: 'new note' }).click()
  await page.getByRole('textbox').fill(content)
  await page.getByRole('button', { name: 'save' }).click()
  await page.getByText(content).waitFor()
}

const testHelper = {
  loginWith, createNote
}

export default testHelper
