import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import ApiController from '../../../helpers/Api';
import { PRODUCT_EDIT } from '../../../constants/api';

class UploadModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            file: null
        }
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
    }
    onFormSubmit(e) {
        e.preventDefault() // Stop form submit
        this.fileUpload(this.state.file);
    }
    onChange(e) {
        this.setState({ file: e.target.files[0] })
    }

    fileUpload = (file) => {
        const productId = this.props.productId;
        var formData = new FormData();
        formData.append("file", file);
        formData.append("id", productId);
        ApiController.post(`${PRODUCT_EDIT.media}/images`, formData, data => {
            this.props.reloadMedia();
            this.props.toggle();
        });
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
                <ModalBody>
                    <form onSubmit={this.onFormSubmit}>
                        <h1>File Upload</h1><br />
                        <input type="file" onChange={this.onChange} />
                        <button type="submit">Upload</button>
                    </form>
                </ModalBody>
            </Modal>
        )
    }
}

export default UploadModal;