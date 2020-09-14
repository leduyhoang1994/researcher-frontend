import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import ApiController from '../../../helpers/Api';
import { PRODUCT_EDIT } from '../../../constants/api';

class UploadModal extends React.Component {

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
        this.props.getListImages(this.state.files)
    }

    fileUpload = (files) => {
        const productId = this.props.productId;
        const formData = new FormData();
        const fileArray = Array.from(files);

        fileArray.forEach(file => {
            formData.append("file", file);
        });
        formData.append("id", productId);
        ApiController.post(`${PRODUCT_EDIT.media}/images`, formData, data => {
            this.props.reloadMedia();
            this.props.toggle();
        });
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} onClosed={this.handlerImages}>
                <ModalBody>
                    <form onSubmit={this.onFormSubmit}>
                        <h1>File Upload</h1><br />
                        <input type="file" onChange={this.onChange} multiple />
                        {/* <button type="submit">Upload</button> */}
                    </form>
                </ModalBody>
            </Modal>
        )
    }
}

export default UploadModal;