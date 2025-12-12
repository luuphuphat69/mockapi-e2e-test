import { Locator, Page } from "@playwright/test";

export default class ProjectPopup{
    page: Page
    popup: Locator
    title: Locator
    projectNameInput: Locator
    apiVersionInput: Locator
    submitBtn: Locator
    isEdit: boolean

    constructor(page: Page, isEdit: boolean) {       
        this.page = page;
        this.popup = page.locator('.bg-card.border.border-border.rounded-lg.p-8.w-full.max-w-md.shadow-xl');
        this.title = page.locator('.text-2xl.font-bold.text-foreground.mb-6')
        this.projectNameInput = page.locator('#project-name');
        this.apiVersionInput = page.locator('#api-prefix')
        this.isEdit = isEdit
        this.submitBtn = isEdit ? page.getByRole('button', {name: "Update"}) : page.getByRole('button', {name: 'Create'});
    }

    async fillProjectName(input: string){
        await this.projectNameInput.fill(input)
    }
    
    async fillApiVersion(input: string){
        await this.apiVersionInput.fill(input)
    }
    async submit(){
        await this.submitBtn.click();
    }
}