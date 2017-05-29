/* @flow */

// libs
import React from 'react';

// src
import { LinkWidgetFactory, DiagramEngine, LinkModel } from '../../../../../src/main';
import { WhiteLinkWidget } from './WhiteLinkWidget';

const factory = React.createFactory(WhiteLinkWidget);

export class WhiteLinkWidgetFactory extends LinkWidgetFactory {
	constructor() {
		super('white');
	}
	
	generateReactWidget(diagramEngine:DiagramEngine, link:LinkModel) {
		return factory({ diagramEngine, link });
	}
}
