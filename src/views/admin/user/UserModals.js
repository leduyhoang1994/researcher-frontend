import React from 'react';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import UserInfo from './UserInfo';
import "../style.scss";

class UserModals extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div>
                <Modal className="modal-user" isOpen={this.props.isOpenModal} toggle={this.props.toggleOpenUserModal}>
                    <ModalBody className="modal-user" >
                        {/* <div className="text-right">
                            <Button
                                className="button"
                                color="primary"
                                onClick={() => {
                                    this.props.toggleOpenUserModal()
                                }}
                            >
                                X
                        </Button>
                        </div> */}
                        <UserInfo
                            type='modal'
                            userId={this.props.userId}
                            reloadUsers={this.props.reloadUsers}
                            toggleOpenUserModal={this.props.toggleOpenUserModal}
                        />

                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

export default UserModals;