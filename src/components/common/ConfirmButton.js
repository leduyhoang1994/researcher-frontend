import { isFunction } from 'formik';
import React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

class ConfirmButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false
        };
    }

    toggle = () => {
        if (isFunction(this.props.onClose) && this.state.isModalOpen) {
            this.props.onClose();
        }
        this.setState({
            isModalOpen: !this.state.isModalOpen
        })

    }

    render() {
        return (
            <>
                <Button
                    {...this.props.btnConfig}
                    onClick={this.toggle}
                >
                    {
                        isFunction(this.props.buttonContent) ? this.props.buttonContent() : this.props.buttonContent
                    }
                </Button>
                <Modal
                    isOpen={this.state.isModalOpen}
                    toggle={this.toggle}
                >
                    <ModalHeader>
                        {isFunction(this.props.confirmHeader) ? this.props.confirmHeader() : this.props.confirmHeader}
                    </ModalHeader>
                    <ModalBody>
                        {isFunction(this.props.confirmContent) ? this.props.confirmContent() : this.props.confirmContent}
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            outline
                            onClick={() => {
                                this.toggle();
                            }}
                        >
                            {this.props?.content?.close}
                        </Button>
                        <Button
                            disabled={this.props.isDisabled}
                            onClick={() => {
                                if (isFunction(this.props.onConfirm)) {
                                    this.props.onConfirm();
                                }
                                if (this.props.closeOnConfirm) {
                                    this.toggle();
                                }
                            }}
                        >
                            {this.props?.content?.confirm}
                        </Button>
                    </ModalFooter>
                </Modal>
            </>
        )
    }
}

export default ConfirmButton;