import React from 'react';
import { Button, Modal, ModalBody } from 'reactstrap';
import EditUboxProducts from "../ubox-category/EditUboxCategories";

class CategoryModals extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const isDisabled = false;

        return (
            <div>
                <Modal isOpen={this.props.isOpenModal} toggle={this.props.toggleOpenCategoryModal}>
                    {/* <ModalHeader>
                        <IntlMessages id="forms.title" />
                    </ModalHeader> */}
                    <ModalBody className="modal-category" >
                        <EditUboxProducts
                            type='modal'
                            toggleOpenCategoryModal={this.props.toggleOpenCategoryModal}
                            getUboxCategories={this.props.getUboxCategories}
                        >

                        </EditUboxProducts>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

export default CategoryModals;