import React from 'react';
import { Row } from 'reactstrap';
import { Colxx } from '../../../components/common/CustomBootstrap';
import './Media.scss';
import UploadModal from './UploadModal';
import ApiController from '../../../helpers/Api';
import { PRODUCT_EDIT } from '../../../constants/api';

class Media extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productId: this.props.productId || 3,
            mediaItems: {
                images: [],
                videos: []
            },
            isUploadModalOpen: false
        }
    }

    componentDidMount() {
        this.loadProductMedia();
    }

    loadProductMedia = () => {
        const { productId } = this.state;
        ApiController.call('get', `${PRODUCT_EDIT.all}/${productId}/media`, {}, data => {
            console.log(data);
            this.setState({
                mediaItems: data
            });
        });
    }

    renderMediaItem = (media) => {
        const url = 'http://localhost:8080/products/3/images'
        const style = {
            backgroundImage: `url('${url}/${media}')`
        };

        return (
            <div className="media-item" style={style}>

            </div>
        );
    }

    toggleUploadModal = () => {
        this.setState({
            isUploadModalOpen: !this.state.isUploadModalOpen
        });
    }

    renderMedia = () => {
        const { mediaItems } = this.state;
        return (
            <div>
                {
                    mediaItems.images.map((mediaItem) => {
                        return this.renderMediaItem(mediaItem);
                    })
                }
                <div className="media-add" onClick={this.toggleUploadModal}>

                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                <Row>
                    <Colxx xxs="12">
                        {
                            this.renderMedia()
                        }
                    </Colxx>
                </Row>
                <UploadModal
                    isOpen={this.state.isUploadModalOpen}
                    toggle={this.toggleUploadModal}
                    productId={this.state.productId}
                    reloadMedia={this.loadProductMedia}
                />
            </div>
        );
    }
}

export default Media;