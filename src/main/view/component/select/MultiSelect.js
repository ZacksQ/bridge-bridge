import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button, Divider, Select} from "antd";
import ButtonGroup from "antd/es/button/button-group";

class MultiSelect extends Component {

    dropdownRender = menu => {
        const {onSelectAll, onReverseSelect, onUnSelect} = this.props;
        return (
            <div>
                <ButtonGroup size="small" onMouseDown={e => e.preventDefault()} style={{margin: "4px 4px"}}>
                    <Button onClick={onSelectAll} style={{marginRight: 12}}>全选</Button>
                    <Button onClick={onReverseSelect} style={{marginRight: 12}}>反选</Button>
                    <Button onClick={onUnSelect}>全不选</Button>
                </ButtonGroup>
                <Divider type="horizontal" style={{margin: "4px 0"}}/>
                {menu}
            </div>
        );
    };

    render() {
        const {data, labelProp, valueProp, placeholder, value, onChange} = this.props;
        return (
            <Select
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                dropdownRender={this.dropdownRender}
                mode="multiple"
                maxTagCount={20}>
                {data.map(d => (<Select.Option key={d[valueProp]} value={d[valueProp]}>{d[labelProp]}</Select.Option>))}
            </Select>
        )
    }
}

MultiSelect.propTypes = {
    data: PropTypes.array,
    labelProp: PropTypes.string.isRequired,
    valueProp: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.array,
    onChange: PropTypes.func,
    onSelectAll: PropTypes.func,
    onReverseSelect: PropTypes.func,
    onUnSelect: PropTypes.func,
};

export default MultiSelect;