import React from 'react';
import { Button, Modal, ModalBody } from 'reactstrap';
import UserInfo from './UserInfo';
import "./style.scss";

class UserModals extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const isDisabled = false;

        return (
            <div>
                <Modal className="modal-user" isOpen={this.props.isOpenModal} toggle={this.props.toggleOpenUserModal}>
                    {/* <ModalHeader>
                        <IntlMessages id="forms.title" />
                    </ModalHeader> */}
                    <ModalBody className="modal-user" >
                        <UserInfo
                            type='modal'
                            userId={this.props?.userId}
                            toggleOpenUserModal={this.props.toggleOpenUserModal}
                        />

                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

export default UserModals;