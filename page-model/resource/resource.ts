import { Page } from "@playwright/test";

export default class ResourcePage {
    page: Page
    constructor(page: Page) {        
        this.page = page;
    }

    get addNewResourceButton(){
        return this.page.getByRole('button', {name: 'Add New Resource'});
    }

    async clickAddNewResourceBtn(){
        await this.addNewResourceButton.click();
    }

    async goTo(projectId: string){
        await this.page.goto(`/projects/${projectId}/resources`)
    }
}