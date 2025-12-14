import { Locator, Page } from "@playwright/test";

export default class ProjectPage{
    page: Page;
    addProjectBtn: Locator

    constructor(page: Page) {
        this.page = page;
        this.addProjectBtn = page.getByRole('button', {name: 'Add New Project'});
    }

    async goTo(){
        await this.page.goto('/projects', {waitUntil: "domcontentloaded"})
        await this.page.waitForURL('**/projects');
    }

    async clickAddNewProjectBtn(){
        await this.addProjectBtn.click();
    }

}