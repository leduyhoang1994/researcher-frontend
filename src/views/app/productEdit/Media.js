import React from 'react';
import { Row, Button } from 'reactstrap';
import { Colxx } from '../../../components/common/CustomBootstrap';
import './Media.scss';
import UploadModal from './UploadModal';
import ApiController from '../../../helpers/Api';
import { PRODUCT_EDIT } from '../../../constants/api';
import GlideComponent from "../../../components/carousel/GlideComponent";

class Media extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: null,
            productId: this.props.productId,
            mediaItems: {
                images: [],
                videos: []
            },
            isUploadModalOpen: false,
            featureImage: this.props.featureImage
        }
    }

    componentDidMount() {
        this.loadProductMedia();
    }

    loadProductMedia = () => {
        this.setState({
            mediaItems: this.props.mediaItems
        });
    }

    setFeatureImage = (url) => {
        this.setState({
            featureImage: url
        });
        this.props.setFeatureImage(url);
    }

    getListMedias = (files) => {
        console.log(files[0])
        this.props.handleFiles(files)
    }

    removeImage = (url) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa file này không?')) {
            var newURL = url.replace(/^[a-z]{4,5}\:\/{2}[a-z0-9.]{1,}\:[0-9]{1,4}.(.*)/, '$1'); // http or https
            ApiController.call('delete', `${PRODUCT_EDIT.media}`, {
                filePath: newURL
            }, data => {
                this.loadProductMedia();
            });
        } 
    }

    renderMediaItem = (media) => {
        const style = {
            backgroundImage: `url('${media}')`
        };

        return (
            <div key={media} className="media-item">
                <div className="media-item-show" style={style}>
                    <div title="Đặt làm ảnh đại diện" onClick={() => {
                        this.setFeatureImage(media)
                    }} className="set-feature-btn">
                        <i className="simple-icon-check" />
                    </div>
                    <div title="Xóa" onClick={() => {
                        this.removeImage(media)
                    }} className="remove-media-btn">
                        <i className="simple-icon-close" />
                    </div>
                </div>
            </div>
        );
    }

    toggleUploadModal = () => {
        this.setState({
            isUploadModalOpen: !this.state.isUploadModalOpen
        });
    }

    renderMedia = () => {
        const { mediaItems,  } = this.state;
        return (
            <>
                {
                    mediaItems.images.map((mediaItem) => {
                        return this.renderMediaItem(mediaItem);
                    })
                }
                {
                    mediaItems.videos.map((mediaItem) => {
                        return this.renderMediaItem(mediaItem);
                    })
                }
            </>
        );
    }

    renderFeatureImage = () => {
        const { featureImage } = this.state;
        const style = {
            width: "400px",
            height: "400px",
            maxWidth: "400px",
            backgroundImage: `url('${featureImage || '/assets/img/default-image.png'}')`,
            maxHeight: "400px",
            backgroundSize: "cover",
            backgroundPosition: "center"
        }
        return (
            <div className="mb-4 text-center">
                <div className="d-inline-block w-100" style={style}>
                </div>
            </div>
        );
    }

    render() {
        const { mediaItems } = this.state;
        let hasMedia = false
        let countMedias = 0
        if (mediaItems && mediaItems.images && mediaItems.videos) {
            hasMedia = mediaItems.images && mediaItems.videos ? mediaItems.images.length > 0 || mediaItems.videos.length > 0 : false;
            countMedias = mediaItems.images.length + mediaItems.videos.length;
        }

        return (
            <div className="mb-4" style={{
                minHeight: '620px'
            }}>
                <Row>
                    <Colxx xxs="12">
                        {
                            this.renderFeatureImage()
                        }
                    </Colxx>
                </Row>
                <Row>
                    <Colxx xxs="12">
                        {
                            hasMedia &&
                            <GlideComponent
                                key={`count-${countMedias}`}
                                settings={
                                    {
                                        rewind: false,
                                        gap: 4,
                                        perView: 3,
                                        type: "slider",
                                        breakpoints: {
                                            600: { perView: 1 },
                                            1400: { perView: 5 }
                                        }
                                    }
                                }
                            >
                                {
                                    this.renderMedia()
                                }
                            </GlideComponent>
                        }
                    </Colxx>
                </Row>
                <Row>
                    <Colxx xxs="12" className="text-center">
                        <Button
                            color="primary"
                            outline
                            onClick={this.toggleUploadModal}>
                            Upload Media
                        </Button>
                    </Colxx>
                </Row>
                <UploadModal
                    isOpen={this.state.isUploadModalOpen}
                    toggle={this.toggleUploadModal}
                    productId={this.state.productId}
                    reloadMedia={this.loadProductMedia}
                    getListImages={this.getListMedias}
                    files={this.props.files}
                />
            </div>
        );
    }
}

export default Media;