import { test, expect } from "@playwright/test";
import { APIBASEURL, testAccounts } from "../../../utilities/common";
import LoginPage from "../../../page-model/auth/Login";
import ResourcePage from "../../../page-model/resource/resource";
import ResourcePopup from "../../../page-model/resource/components-model/popup";

test.beforeEach(async ({ page }) => {
    const testAcc = testAccounts[0];
    const loginPage = new LoginPage(page);
    await loginPage.goTo();

    await loginPage.fillEmail(testAcc.email);
    await loginPage.fillPassword(testAcc.password);
    await loginPage.submitLoginBtn();

    const promise = await page.waitForResponse(APIBASEURL + '/login');
    expect(promise.status()).toBe(200);
})

test.describe('Resource CRUD', () => {
    test('Add new resource', async ({ page }) => {

        let testData = {
            resourceName: 'test-resource',
            schema: [
                { name: 'test-field-1', type: 'number' },
                { name: 'test-field-2', type: 'string' },
                { name: 'test-field-3', type: 'Fake', module: 'person.firstName'}
            ],
            numberOfRecord: 20
        }

        const resourcePage = new ResourcePage(page);
        const resourcePopup = new ResourcePopup(page);

        resourcePopup.setIsEdit(false)

        // Go to resource page -> click 'Add New Resource' button -> Wait for pop up shown up
        await resourcePage.goTo(testAccounts[0].projectId);
        await resourcePage.clickAddNewResourceBtn();
        await expect(resourcePopup.popup).toBeVisible();

        // After popup shown up -> Input resource name
        await resourcePopup.setResourceNameInputValue(testData.resourceName);

        // loop at schema test data -> select options
        for (let i = 1; i <= testData.schema.length; i++) {
            // set (i)th schema line
            resourcePopup.setSelectedSchemaPosition(i);
            await resourcePopup.addFieldButton.click();
            
            //After click 'Add field' button -> Wait for input to shown up
            await expect(resourcePopup.schemaInput).toBeVisible();
            
            // Set values
            await resourcePopup.setSchemaInputValue(testData.schema[i - 1].name)
            await resourcePopup.dataTypeOption.selectOption(testData.schema[i - 1].type);

            if (
                testData.schema[i - 1].type === 'Fake' &&
                testData.schema[i - 1].module !== undefined &&
                testData.schema[i - 1].module !== null
            ) {
                // Wait for fake module dropdown shown up
                await expect(resourcePopup.fakerModuleButton).toBeVisible();
                await resourcePopup.fakerModuleButton.click();
                
                // After click the dropdown -> Wait for the container, which store all the options to shown up
                await expect(resourcePopup.fakerModuleOptionContainer).toBeVisible();
                
                // Select option
                const option = resourcePopup.getFakerModuleOption(testData.schema[i - 1].module!);
                await option.click();
            }
        }
        await resourcePopup.numberOfRecorsInput.fill(testData.numberOfRecord.toString());
        const createResponsePromise = page.waitForResponse(res =>
            res.url() === `${APIBASEURL}/resources/${testAccounts[0].id}/${testAccounts[0].projectId}` &&
            res.request().method() === 'POST',
        );

        await resourcePopup.submitButton.click();
        const response = await createResponsePromise;

        expect(response.status()).toBe(200);
        await expect(resourcePopup.popup).toBeHidden();

    })
})