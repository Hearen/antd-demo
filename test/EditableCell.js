import React from 'react';
import { Input } from 'antd';
import * as Const from '../Const';

export default class EditableCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovering: false,
    };
    this.recordHandleChange = props.parentHandleChange;
  }

  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ value });
    this.recordHandleChange(value);
  }

  render() {
    const { value, editable } = this.props;
    const notHoveringStyle = {
      width: Const.WIDTH,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      height: Const.CELL_HEIGHT,
    };
    const hoverStyle = {
      overflow: 'visible',
      height: 'auto',
      whiteSpace: 'normal',
    };
    const theStyle = this.state.isHovering ? { ...notHoveringStyle, ...hoverStyle } : { ...notHoveringStyle };
    return (
      <div
        className="editable-cell"
        onMouseEnter={() => this.setState({ isHovering: true })}
        onMouseLeave={() => this.setState({ isHovering: false })}
      >
        {
            editable ?
              <div className="editable-cell-input-wrapper">
                <Input
                  defaultValue={value}
                  onChange={this.handleChange}
                />
              </div>
                :
                  <div
                    className="editable-cell-text-wrapper"
                    style={theStyle}
                  >
                    {value || ' '}
                  </div>
        }
      </div>
    );
  }
}

EditableCell.propTypes = {
  value: React.PropTypes.string,
  editable: React.PropTypes.bool,
  parentHandleChange: React.PropTypes.func,
};
