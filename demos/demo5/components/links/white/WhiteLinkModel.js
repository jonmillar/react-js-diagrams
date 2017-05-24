import { LinkModel } from '../../../../../src/main';

export class WhiteLinkModel extends LinkModel {
    constructor() {
        super('white');
        this.linkType = 'white';
    }
}
