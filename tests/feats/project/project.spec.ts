import { expect, test } from "@playwright/test";
import LoginPage from "../../../page-model/auth/Login";
import {APIBASEURL, testAccounts } from "../../../utilities/common";
import ProjectPage from "../../../page-model/projects/Project";
import ProjectPopup from "../../../page-model/projects/components-model/ProjectPopup";
import ProjectCard from "../../../page-model/projects/components-model/ProjectCard";
import ConfirmDelete from "../../../page-model/projects/components-model/ConfirmDelete";


test.beforeEach(async ({page}) => {
    const testAcc = testAccounts[0];
    const loginPage = new LoginPage(page);
    await loginPage.goTo();

    await loginPage.fillEmail(testAcc.email);
    await loginPage.fillPassword(testAcc.password);
    await loginPage.submitLoginBtn();

    const promise = await page.waitForResponse(APIBASEURL + '/login');
    expect(promise.status()).toBe(200);
});

test.describe.serial('Projects CRUD', () => {
    test('Create project', async ({page}) => {
        const insertedData = {name: 'test', version: '/v0'}

        const projectPage = new ProjectPage(page);
        const projectPopup = new ProjectPopup(page, false);

        await projectPage.goTo()
        await projectPage.clickAddNewProjectBtn();
        await expect(projectPopup.popup).toBeVisible();
        await projectPopup.fillProjectName(insertedData.name);
        await projectPopup.fillApiVersion(insertedData.version);

        const promise = page.waitForResponse(res => 
            res.url() === `${APIBASEURL}/projects` && 
            res.status() === 201 &&
            res.request().method() === 'POST'
        )
        await projectPopup.submit();
        const response = await promise;

        expect(response.status()).toBe(201);
    }),

    test('Update (n)th project', async({page}) => {

        let selectedProject = 2
        let updateData = {name: 'test-is-update', version: '/v1'}

        const projectPage = new ProjectPage(page);
        const projectCard = new ProjectCard(page)
        const projectPopup = new ProjectPopup(page, true);

        // Go to Project page
        await projectPage.goTo()

        // Choose selected project and click edit button on project card
        projectCard.setSelectedProjectPosition(selectedProject);
        await projectCard.clickEditProject();
        await expect(projectPopup.popup).toBeVisible();

        // After popup shown up, then fill out infos
        await projectPopup.fillProjectName(updateData.name);
        await projectPopup.fillApiVersion(updateData.version);
        await projectPopup.submit();

        await expect(projectCard.projectName).toHaveText(updateData.name, {useInnerText: true})
        await expect(projectCard.projectVersion).toHaveText(updateData.version, {useInnerText: true})
    })

    test('Delete (n)th project', async({page}) => {
        let selectedProject = 2

        const projectPage = new ProjectPage(page);
        const projectCard = new ProjectCard(page);
        const confirmDelete = new ConfirmDelete(page);
        projectCard.setSelectedProjectPosition(selectedProject)
        
        await projectPage.goTo();
        await projectCard.clickDeleteProject();
        await expect(confirmDelete.popup).toBeVisible();

        await confirmDelete.clickDeleteButton();

        await expect(projectCard.projectName).toHaveCount(0);
    });
})