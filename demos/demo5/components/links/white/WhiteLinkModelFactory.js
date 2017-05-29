/* @flow */

import { AbstractInstanceFactory } from '../../../../../src/AbstractInstanceFactory';
import { WhiteLinkModel } from './WhiteLinkModel';

export class WhiteLinkModelFactory extends AbstractInstanceFactory {
	constructor() {
		super('WhiteLinkModel');
	}
	
	getInstance() {
		return new WhiteLinkModel();
	}
}
