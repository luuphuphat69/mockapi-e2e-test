import { Page } from "@playwright/test";

export default class ResourcePopup{
    page: Page
    selectedSchemaPosition = 0;
    isEdit = false;

    constructor(page: Page) {
        this.page = page
    }

    get popup() {
        return this.page.locator('.bg-card.border.border-border.rounded-lg.p-8.w-full.max-w-2xl.shadow-xl');
    }

    get resourceNameInput(){
        return this.page.locator('#resource-name');
    }

    async setResourceNameInputValue(value: string){
        await this.resourceNameInput.fill(value)
    }

    get addFieldButton(){
        return this.page.getByRole('button', {name: 'Add Field'});
    }

    get schemaInput() {
        return this.page.getByPlaceholder('Field Name').nth(this.selectedSchemaPosition);
    }

    async setSchemaInputValue(value: string){
        this.schemaInput.fill(value)
    }

    get dataTypeOption(){
        return this.page.locator('.bg-background.border.border-border.text-foreground.rounded.px-3.py-2.flex-1').nth(2 * this.selectedSchemaPosition + 1);
    }

    get fakerModuleButton(){
        return this.page.getByRole('button', {name: 'Select module' })
    }

    get fakerModuleOptionContainer(){
        return this.page.locator('.absolute.top-full.left-0.right-0.mt-1.bg-background.border.border-border.rounded.shadow-lg.z-50')
    }

    getFakerModuleOption(nameModule: string){
        return this.fakerModuleOptionContainer.getByRole('button', {name: nameModule})
    }

    get numberOfRecorsInput(){
        return this.popup.locator('input[type="number"]');
    }
    
    setIsEdit(isEdit: boolean){
        this.isEdit = isEdit
    }

    get submitButton(){
        const button = this.isEdit ? this.popup.getByRole('button', {name: "Update"}) : this.popup.getByRole('button', {name: 'Create'});
        return button;
    }

    setSelectedSchemaPosition(pos: number){
        if(pos < 0)
            throw new Error('Position cannot be negative')
        this.selectedSchemaPosition = pos
    }

    getSelectedSchemaPosition(){
        return this.selectedSchemaPosition
    }

}