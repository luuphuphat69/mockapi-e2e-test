import { test, expect } from "@playwright/test";
import { APIBASEURL } from "../../../utilities/common";
import ResourcePage from "../../../page-model/resource/resource";
import ResourcePopup from "../../../page-model/resource/components-model/popup";

test.describe.serial('Resource CRUD', () => {
    test('Add new resource', async ({ page }) => {
        const date = new Date();
        let testData = {
            resourceName: `test-resource ${date.toString()}`,
            schema: [
                { name: 'test-field-1', type: 'number' },
                { name: 'test-field-2', type: 'string' },
                { name: 'test-field-3', type: 'Fake', module: 'person.firstName' }
            ],
            numberOfRecord: 20
        }
        if(!process.env.TEST_PROJECT_ID || !process.env.TEST_USER_ID){
            throw new Error('Missing TEST_PROJECT_ID or TEST_USER_ID');
        }

        const resourcePage = new ResourcePage(page);
        const resourcePopup = new ResourcePopup(page);

        resourcePopup.setIsEdit(false)

        // Go to resource page -> click 'Add New Resource' button -> Wait for pop up shown up
        await resourcePage.goTo(process.env.TEST_PROJECT_ID);
        await resourcePage.clickAddNewResourceBtn();
        await expect(resourcePopup.popup).toBeVisible();
        await expect(resourcePopup.resourceNameInput).toBeEnabled();


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
            res.url() === `${APIBASEURL}/resources/${process.env.TEST_USER_ID}/${process.env.TEST_PROJECT_ID}` &&
            res.request().method() === 'POST',
        );

        await resourcePopup.submitButton.click();
        const response = await createResponsePromise;
        if (response.status() === 400) {
            console.error(await response.json());
        }
        expect(response.status()).toBe(200)
        await expect(resourcePopup.popup).toBeHidden();
    })
})