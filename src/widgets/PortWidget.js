/* @flow */

// libs
import React from 'react';

// src
import type { NodeModel } from '../models/NodeModel';

type DefaultProps = {};

type Props = {
  name: string,
  node: NodeModel
};


type State = {
  selected: boolean
};

export class PortWidget extends React.Component<DefaultProps, Props, State> {
  static defaultProps = {
  };

  state = {
    selected: false
  };

  constructor(props:Props) {
    super(props);
  }

  render() {
    const { name, node } = this.props;
    return (
      <div
        className={`port${(this.state.selected ? ' selected' : '')}`}
        onMouseEnter={() => this.setState({ selected: true })}
        onMouseLeave={() => this.setState({ selected: false })}
        data-name={name}
        data-nodeid={node.getID()}
      />
    );
  }
}
