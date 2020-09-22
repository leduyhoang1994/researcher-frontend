import React from 'react';
import { Modal } from 'reactstrap';

class MediaModals extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    renderMedia = () => {
        if (this.props.type === 'video')
            return (
                <video width="100%" height="100%" controls >
                    <source src={this.props.media} type="video/mp4" />
                </video>
            )
        else
            return (
                <img src={this.props.media} alt="Vela" width="100%" height="100%">
                </img>
            )
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
                {this.renderMedia()}
            </Modal>
        )
    }
}

export default MediaModals;