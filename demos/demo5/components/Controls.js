import React from 'react';

export class Controls extends React.Component {
  render() {
    const { selectedNode, onUndo, onRedo, canUndo, canRedo,
			disableInteractionZoom, onChangeDisableInteractionZoom,
			disableInteractionNodeMove, onChangeDisableInteractionNodeMove,
			disableInteractionNodeSelect, onChangeDisableInteractionNodeSelect,
			disableInteractionLinkSelect, onChangeDisableInteractionLinkSelect,
			disableInteractionLinkCreate, onChangeDisableInteractionLinkCreate
		} = this.props;
    const content = selectedNode ? JSON.stringify(selectedNode.serialize(), null, 2) : '';

  	return (
  	  <div className='controls'>
  	    <div>
  	      <button onClick={onUndo} disabled={!canUndo}>Undo</button>
  	      <button onClick={onRedo} disabled={!canRedo}>Redo</button>
  	    </div>
				<div>
					<label><input type="checkbox" checked={disableInteractionZoom} onChange={onChangeDisableInteractionZoom}/> disableInteractionZoom</label><br/>
					<label><input type="checkbox" checked={disableInteractionNodeMove} onChange={onChangeDisableInteractionNodeMove}/> disableInteractionNodeMove</label><br/>
					<label><input type="checkbox" checked={disableInteractionNodeSelect} onChange={onChangeDisableInteractionNodeSelect}/> disableInteractionNodeSelect</label><br/>
					<label><input type="checkbox" checked={disableInteractionLinkSelect} onChange={onChangeDisableInteractionLinkSelect}/> disableInteractionLinkSelect</label><br/>
					<label><input type="checkbox" checked={disableInteractionLinkCreate} onChange={onChangeDisableInteractionLinkCreate}/> disableInteractionLinkCreate</label><br/>
				</div>
  	    <pre>
  	      {content}
  	    </pre>
    	</div>
  	);
  }
}
