import React from 'react';
import { Button, Form, Input, Modal, ModalBody } from 'reactstrap';
import ApiController from '../../../helpers/Api';
import { UBOX_PRODUCTS } from '../../../constants/api';

class UploadModals extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            files: null
        }
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    onFormSubmit(e) {
        e.preventDefault() // Stop form submit
        console.log('Stop form submit')
        // this.fileUpload(this.state.files);
    }
    onChange(e) {
        this.setState({ files: e.target.files })
    }

    handlerImages = () => {
        if (this.state.files) {
            this.props.getListImages(this.state.files)
        }
    }

    fileUpload = (files) => {
        const productId = this.props.productId;
        const formData = new FormData();
        const fileArray = Array.from(files);

        fileArray.forEach(file => {
            formData.append("file", file);
        });
        formData.append("id", productId);
        ApiController.post(`${UBOX_PRODUCTS.media}/images`, formData, data => {
            this.props.reloadMedia();
            this.props.toggle();
        });
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} onClosed={this.handlerImages}>
                <ModalBody>
                    <Form>
                        <h1>File Upload</h1>
                        <div className="d-block">
                            <Input
                                multiple
                                type="file"
                                id="i_file"
                                name="i_file"
                                className="d-inline-block w-85"
                                accept=".mp4,.mov,.mp4,.flv,.avi,.jpg,.jpeg,.png,.gif"
                                onChange={this.onChange}
                            />
                            <Button
                                type="submit"
                                className="pl-4 pr-4 button "
                                onClick={this.props.toggle}
                            >
                                Upload file
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </Modal>
        )
    }
}

export default UploadModals;