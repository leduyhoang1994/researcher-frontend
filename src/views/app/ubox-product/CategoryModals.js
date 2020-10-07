import React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import IntlMessages from '../../../helpers/IntlMessages';
import EditUboxProducts from "../ubox-category/EditUboxCategories"

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
                    <ModalBody>
                        <EditUboxProducts
                            type='modal'
                        >

                        </EditUboxProducts>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="secondary"
                            onClick={() => {
                                this.props.toggleOpenCategoryModal();
                            }}
                        >
                            Close
                        </Button>
                        <Button variant="primary"
                            disabled={isDisabled}
                            onClick={() => {
                                // this.createCategoriesSet()
                                this.props.toggleOpenCategoryModal();
                            }}
                        >Save</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default CategoryModals;