/* @flow */

// libs
import * as _ from "lodash";

// src
import * as SRD from "../../src/main";

export class DiamondPortModel extends SRD.PortModel{
	position: string;

	constructor(pos:string = 'top'){
		super(pos);
		this.position = pos ;
	}
	
	serialize(){
		return _.merge(super.serialize(),{
			position: this.position,
		});
	}
	
	deSerialize(data:Object) {
		super.deSerialize(data);
		this.position = data.position;
	}
}
