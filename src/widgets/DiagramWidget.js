/* @flow */

// libs
import React from 'react';
import _ from 'lodash';
import get from 'lodash/get';

// src
import { DiagramModel } from '../models/DiagramModel';
import { PointModel } from '../models/PointModel';
import { NodeModel } from '../models/NodeModel';
import { LinkModel } from '../models/LinkModel';
import { PortModel } from '../models/PortModel';
import { SelectingAction, MoveCanvasAction, MoveItemsAction } from './actions';
import { LinkLayerWidget } from './LinkLayerWidget';
import { NodeLayerWidget } from './NodeLayerWidget';
import { Toolkit } from '../Toolkit';

const DEFAULT_ACTIONS = {
  deleteItems: true,
  selectItems: true,
  moveItems: true,
  multiselect: true,
  multiselectDrag: true,
  canvasDrag: true,
  zoom: true,
  copy: true,
  paste: true,
  selectAll: true,
  deselectAll: true
};

export class DiagramWidget extends React.Component {
  static defaultProps = {
    onChange: () => {},
    actions: DEFAULT_ACTIONS
  };

  getActions() {
    if (this.props.actions === null) {
      return {};
    }
    return { ...DEFAULT_ACTIONS, ...(this.props.actions || {}) };
  }

  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    this.props.diagramEngine.setCanvas(null);
    window.removeEventListener('keydown', this.state.windowListener);
  }

  componentWillUpdate(nextProps:Props) {
    if (this.props.diagramEngine.diagramModel.id !== nextProps.diagramEngine.diagramModel.id) {
      this.setState({ renderedNodes: false });
      nextProps.diagramEngine.diagramModel.rendered = true;
    }
    if (!nextProps.diagramEngine.diagramModel.rendered) {
      this.setState({ renderedNodes: false });
      nextProps.diagramEngine.diagramModel.rendered = true;
    }
  }

  componentDidUpdate() {
    if (!this.state.renderedNodes) {
      this.setState({
        renderedNodes: true
      });
    }
  }

  componentDidMount() {
    const { diagramEngine, onChange } = this.props;
    diagramEngine.setCanvas(this.refs['canvas']);
    diagramEngine.setForceUpdate(this.forceUpdate.bind(this));
    const { selectAll, deselectAll, copy, paste, deleteItems } = this.getActions();

    // Add a keyboard listener
    this.setState({
      renderedNodes: true,
      windowListener: window.addEventListener('keydown', event => {
        const selectedItems = diagramEngine.getDiagramModel().getSelectedItems();
        const ctrl = (event.metaKey || event.ctrlKey);

        // Select all
        if (event.keyCode === 65 && ctrl && selectAll) {
          this.selectAll(true);
          event.preventDefault();
          event.stopPropagation();
        }

        // Deselect all
        if (event.keyCode === 68 && ctrl && deselectAll) {
          this.selectAll(false);
          event.preventDefault();
          event.stopPropagation();
        }

        // Copy selected
        if (event.keyCode === 67 && ctrl && selectedItems.length && copy) {
          this.copySelectedItems(selectedItems);
        }

        // Paste from clipboard
        if (event.keyCode === 86 && ctrl && this.state.clipboard && paste) {
          this.pasteSelectedItems(selectedItems);
        }

        // Delete all selected
        if ([8, 46].indexOf(event.keyCode) !== -1 && selectedItems.length && deleteItems) {
          selectedItems.forEach(element => {
            element.remove();
          });

          onChange(diagramEngine.getDiagramModel().serializeDiagram(), { type: 'items-deleted', items: selectedItems });
          this.forceUpdate();
        }
      })
    });
    window.focus();
  }

  copySelectedItems(selectedItems:Array<BaseModel>) {
    const { diagramEngine, onChange, disableInteractionLinkCreate, disableInteractionNodeCreate } = this.props;

    // Cannot copy anything without a node, so ensure some are selected
    const nodes = _.filter(selectedItems, item => item instanceof NodeModel);

    // If there are no nodes, do nothing
    if (!nodes.length) {
      return;
    }

    // Deserialize the existing diagramModel
    const flatModel = diagramEngine.diagramModel.serializeDiagram();

    // Create a new diagramModel to hold clipboard data
    const newModel = new DiagramModel();

    // Create map of GUIDs for replacement
    const gMap = {};

    // Track what was copied to send back to onChange
    const copied = [];

    // Iterate the nodes
    !disableInteractionNodeCreate && _.forEach(flatModel.nodes, node => {
      if (node.selected) {
        // Get the node instance, updated the GUID and deserialize
        const nodeOb = diagramEngine.getInstanceFactory(node._class).getInstance();
        node.id = gMap[node.id] = Toolkit.UID();
        nodeOb.deSerialize(node);

        // Deserialize ports
        _.forEach(node.ports, port => {
          const portOb = diagramEngine.getInstanceFactory(port._class).getInstance();
          port.id = gMap[port.id] = Toolkit.UID();
          port.links = [];
          portOb.deSerialize(port);
          nodeOb.addPort(portOb);
        });

        nodeOb.setSelected(true);
        newModel.addNode(nodeOb);
        copied.push(nodeOb);
      }
    });

    // Iterate the links
    !disableInteractionLinkCreate && _.forEach(flatModel.links, link => {
      if (link.selected) {
        const linkOb = diagramEngine.getInstanceFactory(link._class).getInstance();
        link.id = gMap[link.id] = Toolkit.UID();

        // Change point GUIDs and set selected
        link.points.forEach(point => {
          point.id = Toolkit.UID();
          point.selected = true;
        });

        // Deserialize the link
        linkOb.deSerialize(link);

        // Only add the target if the node was copied and the target exists
        if (gMap[link.target] && gMap[link.source]) {
          const node = newModel.getNode(gMap[link.target]);
          
          if ( node === null ) return;

          linkOb.setTargetPort(node.getPortFromID(gMap[link.targetPort]));
        }

        // Add the source if it exists
        if (gMap[link.source]) {
          const node = newModel.getNode(gMap[link.source]);

          if ( node === null ) return;

          linkOb.setSourcePort(node.getPortFromID(gMap[link.sourcePort]));
          newModel.addLink(linkOb);
          copied.push(linkOb);
        }
      }
    });

    this.setState({ clipboard: newModel });
    onChange(diagramEngine.getDiagramModel().serializeDiagram(), { type: 'items-copied', items: copied });
  }

  pasteSelectedItems() {
    const { diagramEngine, onChange } = this.props;
    const { clipboard } = this.state;
    const pasted = [];

    // Clear existing selections
    diagramEngine.diagramModel.clearSelection();
    this.forceUpdate();

    // Add the nodes to the existing diagramModel
    _.forEach(get(clipboard, 'nodes', []), node => {
      diagramEngine.diagramModel.addNode(node);
      pasted.push(node);
    });
    this.forceUpdate();

    // Add links to the existing diagramModel
    _.forEach(get(clipboard, 'links', []), link => {
      diagramEngine.diagramModel.addLink(link);
      pasted.push(link);
    });
    this.setState({ clipboard: null });

    onChange(diagramEngine.getDiagramModel().serializeDiagram(), { type: 'items-pasted', items: pasted });
  }

  selectAll(select:boolean) {
    const { diagramEngine, onChange, disableInteractionNodeSelect, disableInteractionLinkSelect } = this.props;
    const { nodes, links } = diagramEngine.diagramModel;
    const selected = [];

    // Select all nodes
    !disableInteractionNodeSelect && _.forEach(nodes, node => {
      node.setSelected(select);
      selected.push(node);
    });

    // Select all links
    !disableInteractionLinkSelect && _.forEach(links, link => {
      link.setSelected(select);
      // Select all points
      link.points.forEach(point => point.setSelected(select));
      selected.push(link);
    });

    // Repaint
    this.forceUpdate();

    const type = select ? 'items-select-all' : 'items-deselect-all';
    onChange(diagramEngine.getDiagramModel().serializeDiagram(), { type, items: selected });
  }

  /**
   * Gets a model and element under the mouse cursor
   */
  getMouseElement(event:CustomMouseEvent):{model: BaseModel, element: HTMLElement}|null {
    const { diagramModel } = this.props.diagramEngine;
    const { target } = event;

    // Look for a port
    let element = target.closest('.port[data-name]');
    if (element) {
      const nodeElement = target.closest('.node[data-nodeid]');
      return {
        model: diagramModel.getNode(nodeElement.getAttribute('data-nodeid')).getPort(element.getAttribute('data-name')),
        element
      };
    }

    // Look for a point
    element = target.closest('.point[data-id]');
    if (element) {
      return {
        model: diagramModel.getLink(element.getAttribute('data-linkid')).getPointModel(element.getAttribute('data-id')),
        element
      };
    }

    // Look for a link
    element = target.closest('[data-linkid]');
    if (element) {
      return {
        model: diagramModel.getLink(element.getAttribute('data-linkid')),
        element
      };
    }

    // Look for a node
    element = target.closest('.node[data-nodeid]');
    if (element) {
      return {
        model: diagramModel.getNode(element.getAttribute('data-nodeid')),
        element
      };
    }

    return null;
  }


    const diagramModel = diagramEngine.getDiagramModel();
    event.preventDefault();
    event.stopPropagation();
    diagramModel.setZoomLevel(diagramModel.getZoomLevel() + (event.deltaY / 60));
    diagramEngine.enableRepaintEntities([]);
    this.forceUpdate();
  }

  onMouseMove(event:MouseEvent) {
    const { diagramEngine, disableInteractionNodeMove, disableInteractionNodeSelect,
      disableInteractionLinkSelect, disableInteractionCanvasMove } = this.props;
    const { action, actionType: currentActionType } = this.state;
    const diagramModel = diagramEngine.getDiagramModel();
    const { left, top } = this.refs.canvas.getBoundingClientRect();
    const { multiselectDrag, canvasDrag, moveItems } = this.getActions();

    // Select items so draw a bounding box
    if (action instanceof SelectingAction && multiselectDrag) {
      const relative = diagramEngine.getRelativePoint(event.pageX, event.pageY);

      !disableInteractionNodeSelect && _.forEach(diagramModel.getNodes(), node => {
        if (action.containsElement(node.x, node.y, diagramModel)) {
          node.setSelected(true);
        }
      });

      !disableInteractionLinkSelect && _.forEach(diagramModel.getLinks(), link => {
        let allSelected = true;
        link.points.forEach(point => {
          if (action.containsElement(point.x, point.y, diagramModel)) {
            point.setSelected(true);
          } else {
            allSelected = false;
          }
        });

        if (allSelected) {
          link.setSelected(true);
        }
      });

      action.mouseX2 = relative.x;
      action.mouseY2 = relative.y;
      this.setState({ action, actionType: 'items-drag-selected' });
    } else if (action instanceof MoveItemsAction && moveItems) {
      // Translate the items on the canvas
      action.selectionModels.forEach(model => {
        if ((model.model instanceof NodeModel && !disableInteractionNodeMove) || model.model instanceof PointModel) {
          model.model.x = model.initialX + (
            (event.pageX - get(this, 'state.action.mouseX', 0)) / (diagramModel.getZoomLevel() / 100)
          );
          model.model.y = model.initialY + (
            (event.pageY - get(this, 'state.action.mouseY', 0)) / (diagramModel.getZoomLevel() / 100)
          );
        }
      });

      // Determine actionType, do not override some mouse down
      const disallowed = ['link-created'];
      let actionType = disallowed.indexOf(currentActionType) === -1 ? 'items-moved' : currentActionType;
      if (action.selectionModels.length === 1 && action.selectionModels[0].model instanceof NodeModel) {
        actionType = 'node-moved';
      }

      this.setState({ actionType });

      // Translate the actual canvas
      diagramModel.setOffset(
        get(action, 'initialOffsetX', 0) + (
          (event.pageX - left - get(this, 'state.action.mouseX', 0)) / (diagramModel.getZoomLevel() / 100)
        ),
        get(action, 'initialOffsetY', 0) + (
          (event.pageY - top - get(this, 'state.action.mouseY', 0)) / (diagramModel.getZoomLevel() / 100)
        )
      );
      this.setState({ action, actionType: 'canvas-drag' });
    }
  }

  onMouseDown(event:CustomMouseEvent) {
    const { diagramEngine, disableInteractionNodeSelect, disableInteractionLinkSelect, disableInteractionLinkCreate } = this.props;
    const diagramModel = diagramEngine.getDiagramModel();


    diagramEngine.clearRepaintEntities();

    // Check if this is the canvas
    if (model === null) {
      // Check for a multiple selection
      if (event.shiftKey && multiselectDrag) {
        const relative = diagramEngine.getRelativePoint(event.pageX, event.pageY);
        this.setState({
          action: new SelectingAction(
            relative.x, relative.y
          ),
          actionType: 'canvas-shift-select'
        });
      } else {
        // This is a drag canvas event
        const relative = diagramEngine.getRelativePoint(event.pageX, event.pageY);
        diagramModel.clearSelection();

        this.setState({
          action: new MoveCanvasAction(relative.x, relative.y, diagramModel),
          actionType: 'canvas-click'
        });
      }
    } else if (model.model instanceof PortModel) {
      const { linkInstanceFactory } = diagramEngine;

      // This is a port element, we want to drag a link
      if (disableInteractionLinkCreate) return;

      const relative = diagramEngine.getRelativeMousePoint(event);

      link.setSourcePort(model.model);

      link.getFirstPoint().updateLocation(relative);
      link.getLastPoint().updateLocation(relative);

      diagramModel.clearSelection();
      link.getLastPoint().setSelected(true);
      diagramModel.addLink(link);

      this.setState({
        action: new MoveItemsAction(event.pageX, event.pageY, diagramEngine),
        actionType: 'link-created'
      });
    } else if (selectItems) {
      // It's a direct click selection
      let deselect = false;
      const isSelected = model.model.isSelected();

      // Clear selections if this wasn't a shift key or a click on a selected element
      if (!event.shiftKey && !isSelected || !multiselect && !isSelected) {
        diagramModel.clearSelection(false, true);
      }

      // Skip if it's a node and node selection is disabled
      if (disableInteractionNodeSelect && model.model instanceof NodeModel) return;

      // Skip if it's a link and link selection is disabled
      if (disableInteractionLinkSelect && model.model instanceof LinkModel) return;

      // Is this a deselect or select?
      if (event.shiftKey && model.model.isSelected()) {
        model.model.setSelected(false);
        deselect = true;
      } else {
        model.model.setSelected(true);

        const __model__ = model.model;
        if ( __model__ instanceof NodeModel ) {
          diagramModel.nodeSelected({model: __model__, element: model.element});
        }
      }

      // Get the selected items and filter out point model
      const selected = diagramEngine.getDiagramModel().getSelectedItems();
      const filtered = _.filter(selected, item => !(item instanceof PointModel));
      const isLink = model.model instanceof LinkModel;
      const isNode = model.model instanceof NodeModel;
      const isPoint = model.model instanceof PointModel;    

      // Determine action type
      let actionType = 'items-selected';
      if (deselect && isLink) {
        actionType = 'link-deselected';
      } else if (deselect && isNode && !disableInteractionNodeSelect) {
        actionType = 'node-deselected';
      } else if (deselect && isPoint) {
        actionType = 'point-deselected';
      } else if ((selected.length === 1 || selected.length === 2 && filtered.length === 1) && isLink) {
        actionType = 'link-selected';
      } else if (selected.length === 1 && isNode && !disableInteractionNodeSelect) {
        actionType = 'node-selected';
      } else if (selected.length === 1 && isPoint) {
        actionType = 'point-selected';
      }

      this.setState({
        action: new MoveItemsAction(event.pageX, event.pageY, diagramEngine),
        actionType
      });
    }
  }

  onMouseUp(event:CustomMouseEvent) {
    const { diagramEngine, onChange } = this.props;
    const { action, actionType } = this.state;
    const element = this.getMouseElement(event);
    const actionOutput: {
      type: string,
      event?: CustomMouseEvent,
      model?: NodeModel,
      linkModel?: LinkModel,
      portModel?: PortModel,
      items?: Array<BaseModel>
    } = {
      type: actionType
    };

    if (element === null) {
      // No element, this is a canvas event
      // actionOutput.type = 'canvas-event';
      actionOutput.event = event;
    } else if (action instanceof MoveItemsAction) {
      // Add the node model to the output

      const __model__ = element.model;

      if (__model__ instanceof NodeModel) {
        actionOutput.model = __model__;
      }

      // Check if we going to connect a link to something
      action.selectionModels.forEach(model => {
        // Only care about points connecting to things or being created
        if (model.model instanceof PointModel) {
          // Check if a point was created
          if (element.element.tagName === 'circle' && actionOutput.type !== 'link-created') {
            actionOutput.type = 'point-created';
          }

          if (__model__ instanceof PortModel) {
            // Connect the link
            model.model.getLink().setTargetPort(__model__);

            // Link was connected to a port, update the output
            actionOutput.type = 'link-connected';
            delete actionOutput.model;
            actionOutput.linkModel = model.model.getLink();
            actionOutput.portModel = __model__;
          }
        }
      });
    }

    const attachItems = ['items-selected', 'items-drag-selected', 'items-moved', 'node-deselected', 'link-deselected'];
    if (attachItems.indexOf(actionType) !== -1) {
      actionOutput.items = _.filter(diagramEngine.getDiagramModel().getSelectedItems(),
        item => !(item instanceof PointModel));
    }
    if (actionType === 'items-moved') {
      delete actionOutput.model;
    }

    diagramEngine.clearRepaintEntities();
    if (actionOutput.type !== 'unknown') {
      onChange(diagramEngine.getDiagramModel().serializeDiagram(), actionOutput);
    }
    this.setState({ action: null, actionType: 'unknown' });
  }

  renderLinkLayerWidget() {
    const { diagramEngine } = this.props;
    const diagramModel = diagramEngine.getDiagramModel();

    if (!this.state.renderedNodes) {
      return null;
    }

    return (
      <LinkLayerWidget
        diagramEngine={diagramEngine}
        pointAdded={(point, event) => {
          event.stopPropagation();
          diagramModel.clearSelection(point);
          this.setState({
            action: new MoveItemsAction(event.pageX, event.pageY, diagramEngine)
          });
        }}
      />
    );
  }

  renderSelector() {
    const { action } = this.state;
    const offsetWidth = this.refs.canvas && this.refs.canvas.offsetWidth || window.innerWidth;
    const offsetHeight = this.refs.canvas && this.refs.canvas.offsetHeight || window.innerHeight;

    if (!(action instanceof SelectingAction)) {
      return null;
    }

    const style = {
      width: Math.abs(action.mouseX2 - action.mouseX),
      height: Math.abs(action.mouseY2 - action.mouseY),
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    };

    if ((action.mouseX2 - action.mouseX) < 0) {
      style.right = offsetWidth - action.mouseX;
    } else {
      style.left = action.mouseX;
    }

    if ((action.mouseY2 - action.mouseY) < 0) {
      style.bottom = offsetHeight - action.mouseY;
    } else {
      style.top = action.mouseY;
    }

    return (
      <div
        className='selector'
        style={style}
      />
    );
  }

  render() {
    const { diagramEngine } = this.props;

    return (
      <div
        ref='canvas'
        className='react-js-diagrams-canvas'
        onWheel={this.onWheel.bind(this)}
        onMouseMove={this.onMouseMove.bind(this)}
        onMouseDown={this.onMouseDown.bind(this)}
        onMouseUp={this.onMouseUp.bind(this)}
      >
        <NodeLayerWidget diagramEngine={diagramEngine} />
        {this.renderLinkLayerWidget()}
        {this.renderSelector()}
      </div>
    );
  }
}
