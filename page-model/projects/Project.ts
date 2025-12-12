import { Locator, Page } from "@playwright/test";
import { BASEURL } from "../../utilities/common";

export default class ProjectPage{
    page: Page;
    addProjectBtn: Locator

    constructor(page: Page) {
        this.page = page;
        this.addProjectBtn = page.getByRole('button', {name: 'Add New Project'});
    }

    async goTo(){
        await this.page.goto(BASEURL + '/projects')
    }

    async clickAddNewProjectBtn(){
        await this.addProjectBtn.click();
    }

}