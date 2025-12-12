import { Locator, Page } from "@playwright/test";

export default class ConfirmDelete{
    page: Page
    popup: Locator
    constructor(page: Page) {
        this.page = page
        this.popup = page.locator('.bg-card.border.border-border.rounded-lg.p-8.w-full.max-w-md.shadow-xl');
    }
    
    get deleteButton(){
        return this.popup.getByRole('button', {name: "Delete"});   
    }

    async clickDeleteButton(){
        await this.deleteButton.click();
    }
}