import React from 'react';
import { Row, Button } from 'reactstrap';
import { Colxx } from '../../../components/common/CustomBootstrap';
import './Media.scss';
import UploadModal from './UploadModal';
import ApiController from '../../../helpers/Api';
import { PRODUCT_EDIT } from '../../../constants/api';
import GlideComponent from "../../../components/carousel/GlideComponent";
import { NotificationManager } from '../../../components/common/react-notifications';
import MediaModal from './MediaModal';

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
            isMediaModalOpen: false,
            featureImage: this.props.featureImage,
            mediaModal: null,
            whereMediaModal: null,
            typeMediaModal: null
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
        this.props.handleFiles(files)
    }

    removeImageLocal = (index) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa file này không?')) {
            this.props.handleRemoveMediaLocal(index)
        }
    }

    removeImage = (url) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa file này không?')) {
            var newURL = url.replace(/^[a-z]{4,5}\:\/{2}[a-z0-9.]{1,}\:[0-9]{1,4}.(.*)/, '$1'); // http or https
            ApiController.call('delete', `${PRODUCT_EDIT.media}`, {
                filePath: newURL
            }, data => {
                this.props.handleRemoveMediaServer()
                this.loadProductMedia();
            });
        }
    }

    renderMediaItem = (media, where, index, typeMedia) => {
        let backgroundImage = `url('${media}')`;
        if (typeMedia === 'video') backgroundImage = `url('/assets/img/video-thumbnail.png')`

        const style = {
            backgroundImage: backgroundImage
        };

        return (
            <div key={index || media} className="media-item">
                <div name="media-view" className="media-item-show" style={style} onClick={(e) => {
                    this.setState({
                        mediaModal: media,
                        whereMediaModal: where,
                        typeMediaModal: typeMedia
                    })
                    this.toggleMediaModal()
                }}>
                    <div title={where === 'local' ? 'Ảnh chưa được lưu' : 'Đặt làm ảnh đại diện'} onClick={(e) => {
                        if (where === 'local') {
                            NotificationManager.error("Vui lòng lưu ảnh trước khi đặt ảnh đại diện", "Thất bại");
                        } else {
                            this.setFeatureImage(media);
                        }
                        e.stopPropagation()
                    }}
                        className={where === 'local' || typeMedia === 'video' ? '' : 'set-feature-btn'}
                    >
                        <i className={where === 'local' || typeMedia === 'video' ? '' : 'simple-icon-check'} />
                    </div>
                    <div title="Xóa" onClick={(e) => {
                        where === 'local' ? this.removeImageLocal(index) : this.removeImage(media)
                        e.stopPropagation()
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

    toggleMediaModal = () => {
        this.setState({
            isMediaModalOpen: !this.state.isMediaModalOpen
        });
    }

    renderMedia = () => {
        let { images, videos } = this.state.mediaItems
        let { fileBase64 } = this.props

        images = images || []
        videos = videos || []
        fileBase64 = fileBase64 || []

        return (
            <>
                {
                    images.map((image) => {
                        return this.renderMediaItem(image, 'server', null, 'image');
                    })
                }
                {
                    videos.map((video) => {
                        return this.renderMediaItem(video, 'server', null, 'video');
                    })
                }
                {
                    fileBase64.map((media, index) => {
                        const arrMedia = media.split('#*#*#*#*#')
                        return this.renderMediaItem(arrMedia[1], 'local', index, arrMedia[0]);
                    })
                }
            </>
        );
    }

    renderFeatureImage = () => {
        const { featureImage } = this.props;
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
        const { fileBase64 } = this.props;
        let hasMedia = false
        let countMedias = 0
        if (mediaItems && mediaItems.images && mediaItems.videos) {
            hasMedia = mediaItems.images && mediaItems.videos ? mediaItems.images.length > 0 || mediaItems.videos.length > 0 : false;
            countMedias = mediaItems.images.length + mediaItems.videos.length;
        }

        hasMedia = hasMedia || fileBase64;

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
                />
                <MediaModal
                    isOpen={this.state.isMediaModalOpen}
                    toggle={this.toggleMediaModal}
                    media={this.state.mediaModal}
                    where={this.state.whereMediaModal}
                    type={this.state.typeMediaModal}
                />
            </div>
        );
    }
}

export default Media;