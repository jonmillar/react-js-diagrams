// libs
import React from 'react';

// src
import { LinkWidgetFactory } from '../../../../../src/main';
import { WhiteLinkWidget } from './WhiteLinkWidget';

const factory = React.createFactory(WhiteLinkWidget);

export class WhiteLinkWidgetFactory extends LinkWidgetFactory {
	constructor() {
		super('white');
	}
	
	generateReactWidget(diagramEngine, link) {
		return factory({ diagramEngine, link });
	}
}
