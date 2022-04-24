import React, {Component} from "react";
import PropTypes from "prop-types";
import "./scroll_body.css";

class ScrollBody extends Component {
    render() {
        const {maxHeight} = this.props;
        return (
            <div className="scroll-body" style={{maxHeight}}>
                {this.props.children}
            </div>
        )
    }
}

ScrollBody.propTypes = {
    maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ScrollBody;